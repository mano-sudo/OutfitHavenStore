import React, { useEffect, useState } from "react";
import { Regions } from "../Components/Regions";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";

const CheckOut = () => {
  const navigate = useNavigate();
  const { cartItems, fetchCart, clearCart } = useCart();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    postalCode: "",
    city: "",
    region: "",
    phone: "",
    saveInfo: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [emailStatus, setEmailStatus] = useState({ sent: false, error: null });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUserData();
    fetchCart();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "https://outfithavenstore-backend.onrender.com/api/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setFormData((prev) => ({
          ...prev,
          email: data.email || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          address: data.address?.street || "",
          apartment: "",
          postalCode: data.address?.zipCode || "",
          city: data.address?.city || "",
          region: data.address?.state || "",
          phone: data.phoneNumber || "",
          saveInfo: true,
        }));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const sendOrderConfirmationEmail = async (orderDetails) => {
    try {
      setEmailStatus({ sent: false, error: null });
      const response = await fetch(
        "https://outfithavenstore-backend.onrender.com/api/send-order-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add any authentication headers your server needs
          },
          body: JSON.stringify({
            to: formData.email,
            from: "your-verified-email@yourdomain.com", // Important!
            replyTo: "support@yourdomain.com",
            subject: `Order Confirmation - #${
              orderDetails.orderId || "Pending"
            }`,
            text: `Thank you for your order #${orderDetails.orderId}...`, // Plain text version
            html: `<p>Thank you for your order...</p>`, // HTML version
            orderDetails,
          }),
        }
      );

      if (!response.ok) {
        throw new Error((await response.text()) || "Failed to send email");
      }

      const result = await response.json();
      setEmailStatus({ sent: true, error: null });
      return result;
    } catch (error) {
      console.error("Email error:", error);
      setEmailStatus({ sent: false, error: error.message });
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmationModal(true);
  };

  const confirmOrder = async () => {
    setOrderProcessing(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token missing");

      // Prepare order data
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.productId._id,
          size: item.size,
          quantity: item.quantity,
          price: item.productId.price,
        })),
        shippingInfo: {
          ...formData,
          phoneNumber: formData.phone,
        },
        total:
          cartItems.reduce(
            (sum, item) => sum + item.productId.price * item.quantity,
            0
          ) + 140,
      };

      // Submit order
      const orderResponse = await fetch(
        "https://outfithavenstore-backend.onrender.com/api/orders/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      const orderResult = await orderResponse.json();
      if (!orderResponse.ok)
        throw new Error(orderResult.message || "Order failed");

      // Prepare email details
      const orderDetails = {
        orderId: orderResult.order?._id || "N/A",
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.region} ${formData.postalCode}`,
        },
        items: cartItems.map((item) => ({
          name: item.productId.name,
          size: item.size,
          quantity: item.quantity,
          price: item.productId.price,
          total: item.productId.price * item.quantity,
        })),
        subtotal: cartItems.reduce(
          (sum, item) => sum + item.productId.price * item.quantity,
          0
        ),
        shipping: 140,
        total: orderData.total,
      };

      // Send email
      await sendOrderConfirmationEmail(orderDetails);

      // Update user info if requested
      if (formData.saveInfo) {
        await updateUserInfo(token, formData);
      }

      // Clear cart - add error handling
      try {
        if (typeof clearCart === "function") {
          await clearCart();
        } else {
          console.error("clearCart is not a function");
          // Optionally handle this case (e.g., show warning but continue)
        }
      } catch (cartError) {
        console.error("Error clearing cart:", cartError);
        // Continue with navigation despite cart clearing error
      }

      navigate("/cart");
    } catch (error) {
      console.error("Order error:", error);
      alert(`Order processing error: ${error.message}`);
    } finally {
      setOrderProcessing(false);
      setShowConfirmationModal(false);
    }
  };

  const updateUserInfo = async (token, formData) => {
    try {
      await fetch(
        "https://outfithavenstore-backend.onrender.com/api/user/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phone,
            address: {
              street: formData.address,
              city: formData.city,
              state: formData.region,
              zipCode: formData.postalCode,
            },
          }),
        }
      );
    } catch (error) {
      console.error("User info update failed:", error);
    }
  };

  const cancelOrder = () => {
    setShowConfirmationModal(false);
  };

  const shippingPrice = 140;

  if (isLoading) return <div className="mt-24 text-center">Loading...</div>;
  if (!cartItems.length)
    return <div className="mt-24 text-center">Your cart is empty</div>;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-24 flex flex-col lg:flex-row max-w-6xl mx-auto p-4 gap-8"
      >
        {/* Left Column - Form Fields */}
        <div className="flex-1">
          {/* Contact Information */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Contact</h2>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full border p-2 mb-2 rounded-md"
              required
              pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
              title="Please enter a valid email address"
            />
            <label className="flex items-center text-sm gap-2">
              <input
                type="checkbox"
                checked={formData.saveInfo}
                onChange={handleInputChange}
                name="saveInfo"
              />
              Email me with news and offers
            </label>
          </div>

          {/* Delivery Information */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Delivery</h2>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First name"
                className="border p-2 rounded-md"
                required
                minLength="2"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last name"
                className="border p-2 rounded-md"
                required
                minLength="2"
              />
            </div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="w-full border p-2 mb-2 rounded-md"
              required
            />
            <input
              type="text"
              name="apartment"
              value={formData.apartment}
              onChange={handleInputChange}
              placeholder="Apartment, suite, etc. (Optional)"
              className="border p-2 w-full mb-2 rounded-md"
            />
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Postal Code"
                className="border p-2 rounded-md"
                required
                pattern="\d{4}"
                title="4-digit postal code"
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                className="border p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-2">
              <select
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className="w-full border p-2 mb-2 rounded-md"
                required
              >
                <option value="">Select Region</option>
                {Regions.map((region, index) => (
                  <option key={index} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="w-full border p-2 mb-2 rounded-md"
                required
                pattern="[0-9]{11}"
                title="11-digit phone number"
              />
            </div>
            <label className="flex items-center gap-2 text-sm rounded-md">
              <input
                type="checkbox"
                checked={formData.saveInfo}
                onChange={handleInputChange}
                name="saveInfo"
              />
              Save this information for next time
            </label>
          </div>

          {/* Payment Method */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
            <div className="flex items-center gap-2 p-3 border bg-gray-50 rounded-md">
              <input
                type="radio"
                id="cod"
                name="paymentMethod"
                value="Cash on Delivery"
                defaultChecked
                disabled
              />
              <label htmlFor="cod" className="text-gray-700 font-medium">
                Cash on Delivery (COD)
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-1 mb-2">
              Only COD is supported at the moment.
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 font-bold text-center rounded-md mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Place Order"}
          </button>
        </div>

        {/* Right Column - Order Summary */}
        <div className="w-full lg:w-1/3 border rounded p-4 bg-gray-50">
          {cartItems.map((item, index) => (
            <div
              key={`${item.productId._id}-${item.size}`}
              className="flex justify-between items-center mb-4"
            >
              <div className="flex items-center gap-2">
                <img
                  src={item.productId.images?.[0] || "default-image.jpg"}
                  alt={item.productId.name}
                  className="w-16 h-16 object-cover"
                />
                <div>
                  <p className="font-semibold">{item.productId.name}</p>
                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <p>₱{(item.productId.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}

          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal -</span>
            <span>
              ₱
              {cartItems
                .reduce(
                  (total, item) => total + item.productId.price * item.quantity,
                  0
                )
                .toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Shipping -</span>
            <span>₱{shippingPrice.toLocaleString()}</span>
          </div>

          <div className="mt-6 border-t">
            <div className="mt-4 flex justify-between text-lg font-medium">
              <span>Total</span>
              <span>
                ₱
                {(
                  cartItems.reduce(
                    (total, item) =>
                      total + item.productId.price * item.quantity,
                    0
                  ) + shippingPrice
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Your Order</h2>
            <p className="mb-4">
              Please review your order details before confirming:
            </p>

            <div className="mb-4 max-h-60 overflow-y-auto">
              <h3 className="font-semibold mb-2">Order Summary:</h3>
              {cartItems.map((item) => (
                <div
                  key={`${item.productId._id}-${item.size}`}
                  className="flex justify-between items-center mb-2"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.productId.images?.[0] || "default-image.jpg"}
                      alt={item.productId.name}
                      className="w-16 h-16 object-cover"
                    />
                    <div>
                      <p className="font-semibold">{item.productId.name}</p>
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-lg">
                    ₱{(item.productId.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <p className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>
                    ₱
                    {cartItems
                      .reduce(
                        (sum, item) =>
                          sum + item.productId.price * item.quantity,
                        0
                      )
                      .toLocaleString()}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₱{shippingPrice.toLocaleString()}</span>
                </p>
                <p className="flex justify-between font-semibold mt-2">
                  <span>Total:</span>
                  <span>
                    ₱
                    {(
                      cartItems.reduce(
                        (sum, item) =>
                          sum + item.productId.price * item.quantity,
                        0
                      ) + shippingPrice
                    ).toLocaleString()}
                  </span>
                </p>
              </div>
            </div>

            {emailStatus.error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                Email warning: {emailStatus.error}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                onClick={cancelOrder}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                disabled={orderProcessing}
              >
                Cancel
              </button>
              <button
                onClick={confirmOrder}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={orderProcessing}
              >
                {orderProcessing ? "Processing..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckOut;

