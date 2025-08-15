import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartVersion, setCartVersion] = useState(0);

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://outfithavenstore-backend.onrender.com/api/cart",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok && data.cart) {
        setCartItems(data.cart.products);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return [];

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://outfithavenstore-backend.onrender.com/api/orders",
        {
          // Changed to plural
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        return data.orders || [];
      }
      return [];
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const triggerCartUpdate = useCallback(() => {
    setCartVersion((prev) => prev + 1);
  }, []);

  const clearCart = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://outfithavenstore-backend.onrender.com/api/cart/clear",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      setCartItems([]);
      return true;
    } catch (error) {
      console.error("Error clearing cart:", error);
      try {
        const deletePromises = cartItems.map((item) =>
          fetch(
            "https://outfithavenstore-backend.onrender.com/api/cart/remove",
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                productId: item.productId._id,
                size: item.size,
              }),
            }
          )
        );

        await Promise.all(deletePromises);
        setCartItems([]);
        return true;
      } catch (fallbackError) {
        console.error("Fallback clearing also failed:", fallbackError);
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  }, [cartItems]);

  const addToCart = async (product, size, quantity = 1) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://outfithavenstore-backend.onrender.com/api/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product._id,
            size,
            quantity,
          }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        triggerCartUpdate();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding item to cart:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId, size) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://outfithavenstore-backend.onrender.com/api/cart/remove",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId, size }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        triggerCartUpdate();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error removing item from cart:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId, size, newQuantity) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://outfithavenstore-backend.onrender.com/api/cart/update",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId, size, quantity: newQuantity }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        triggerCartUpdate();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating quantity:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const increaseQuantity = async (productId, size) => {
    const currentItem = cartItems.find(
      (item) => item.productId._id === productId && item.size === size
    );
    if (!currentItem) return false;
    return await updateQuantity(productId, size, currentItem.quantity + 1);
  };

  const decreaseQuantity = async (productId, size) => {
    const currentItem = cartItems.find(
      (item) => item.productId._id === productId && item.size === size
    );
    if (!currentItem) return false;
    if (currentItem.quantity <= 1) return await removeFromCart(productId, size);
    return await updateQuantity(productId, size, currentItem.quantity - 1);
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart, cartVersion]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        fetchCart: triggerCartUpdate,
        clearCart,
        fetchOrders,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
