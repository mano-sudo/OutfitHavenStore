import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { FiMinus } from "react-icons/fi";
import { useCart } from "./CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    isLoading,
    fetchOrders,
  } = useCart();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadOrders = async () => {
      setLoadingOrders(true);
      try {
        const userOrders = await fetchOrders();
        setOrders(userOrders);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };
    loadOrders();
  }, [fetchOrders]);

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + (item.productId?.price || 0) * (item.quantity || 1),
    0
  );

  const handleQuantityChange = async (productId, size, isIncrease) => {
    if (isLoading) return;
    await (isIncrease ? increaseQuantity : decreaseQuantity)(productId, size);
  };

  const handleRemoveProduct = async (productId, size) => {
    if (isLoading) return;
    await removeFromCart(productId, size);
  };

  return (
    <div className="max-w-xl mx-auto mt-24 p-4 text-center">
      <h1 className="font-bold text-xl mb-2">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div>
          <p className="text-sm mb-6">It appears that your cart is empty!</p>
          <Link
            to="/"
            className="border border-black px-6 py-2 font-bold inline-block"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      ) : (
        <div className="text-left">
          <p className="text-sm text-center">
            Total Items ({cartItems.length})
          </p>

          {cartItems.map((item) => (
            <div
              key={`${item.productId?._id}-${item.size}`}
              className="border-t pt-4 mt-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={item.productId?.images?.[0] || "default-image.jpg"}
                    alt={item.productId?.name}
                    className="w-24 h-16 object-cover mr-4"
                  />
                  <div>
                    <h2 className="font-bold">{item.productId?.name}</h2>
                    <p className="text-sm">Size: {item.size}</p>
                    <p className="text-sm">₱{item.productId?.price}</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleRemoveProduct(item.productId?._id, item.size)
                  }
                  className="text-xl font-light"
                  aria-label="Remove item"
                  disabled={isLoading}
                >
                  <RxCross2 />
                </button>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-medium">₱{item.productId?.price}</p>
                <div className="flex items-center border px-2 pt-1">
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item.productId?._id,
                        item.size,
                        false
                      )
                    }
                    className="px-2"
                    aria-label="Decrease quantity"
                    disabled={isLoading}
                  >
                    <FiMinus />
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.productId?._id, item.size, true)
                    }
                    className="px-2"
                    aria-label="Increase quantity"
                    disabled={isLoading}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="border-t mt-6 pt-4">
            <div className="flex justify-between text-lg font-medium">
              <span>Subtotal:</span>
              <span>₱{subtotal.toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Excluding taxes and shipping
            </p>
            <div className="mt-6">
              <Link
                to="/checkout"
                className="w-full bg-black text-white py-3 inline-block text-center font-bold mb-2"
              >
                CHECKOUT
              </Link>
              <Link
                to="/"
                className="w-full border border-black py-3 font-bold inline-block text-center"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        </div>
      )}

      {loadingOrders ? (
        <div className="mt-12 text-center">Loading order history...</div>
      ) : orders.length > 0 ? (
        <div className="mt-12 text-left">
          <h2 className="font-bold text-lg mb-4">Your Orders</h2>
          {orders.map((order) => (
            <div key={order._id} className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">
                  Order #{order._id.slice(-6).toUpperCase()}
                </span>
                <span
                  className={`text-sm ${
                    order.status === "delivered"
                      ? "text-green-600"
                      : order.status === "cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>

              {order.items.map((item) => (
                <div
                  key={`${item.productId?._id}-${item.size}`}
                  className="flex mb-3"
                >
                  <img
                    src={item.productId?.images?.[0] || "default-image.jpg"}
                    alt={item.productId?.name}
                    className="w-16 h-12 object-cover mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.productId?.name}</p>
                    <p className="text-sm">Size: {item.size}</p>
                    <p className="text-sm">
                      ₱{item.price} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}

              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-medium">Total:</span>
                <span className="font-medium">
                  ₱{order.total.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center">No order history found</div>
      )}
    </div>
  );
};

export default Cart;
