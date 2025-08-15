// cartRoutes.js
import express from "express";
import SavedProduct from "../models/SaveProduct.js";
import { authMiddleware } from "./auth.js"; // Ensure correct import

const router = express.Router();

// GET Cart (fetch the cart for the logged-in user)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await SavedProduct.findOne({ userId })
      .populate("products.productId", "name price images sizes") // Populate product details
      .exec();

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart" });
  }
});

// POST Add to Cart (add a product to the cart)
router.post("/", authMiddleware, async (req, res) => {
  const { productId, size, quantity } = req.body;
  const userId = req.userId;

  // Input validation
  if (!productId || !size || !quantity || quantity <= 0) {
    return res.status(400).json({
      error:
        "Invalid input. Please provide a valid product, size, and quantity.",
    });
  }

  try {
    let cart = await SavedProduct.findOne({ userId });

    if (!cart) {
      // If no cart exists for this user, create a new one
      cart = new SavedProduct({
        userId,
        products: [{ productId, size, quantity }],
      });
    } else {
      // Check if product already exists in the cart
      const existingProductIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId && item.size === size
      );
      if (existingProductIndex !== -1) {
        // If product exists, update the quantity
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        // Add new product to cart
        cart.products.push({ productId, size, quantity });
      }
    }

    await cart.save();
    res.status(200).json({
      message: "Item added to cart successfully!",
      cart: cart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "An error occurred while updating the cart. Please try again.",
    });
  }
});

// PATCH Update Product Quantity in Cart
router.patch("/update", authMiddleware, async (req, res) => {
  const { productId, size, quantity } = req.body;
  const userId = req.userId;

  if (!productId || !size || !quantity || quantity <= 0) {
    return res.status(400).json({
      error:
        "Invalid input. Please provide valid productId, size, and quantity.",
    });
  }

  try {
    let cart = await SavedProduct.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const existingProductIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (existingProductIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    // Update quantity
    cart.products[existingProductIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({
      message: "Cart updated successfully",
      cart: cart,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating cart" });
  }
});

// DELETE Remove Product from Cart
router.delete("/remove", authMiddleware, async (req, res) => {
  const { productId, size } = req.body;
  const userId = req.userId;

  if (!productId || !size) {
    return res.status(400).json({
      error: "Invalid input. Please provide valid productId and size.",
    });
  }

  try {
    let cart = await SavedProduct.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    // Remove product from cart
    cart.products.splice(productIndex, 1);
    await cart.save();

    res.status(200).json({
      message: "Product removed from cart successfully",
      cart: cart,
    });
  } catch (error) {
    res.status(500).json({ error: "Error removing product from cart" });
  }
});

// DELETE Clear Entire Cart
router.delete("/clear", authMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    const cart = await SavedProduct.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Clear all products from the cart
    cart.products = [];
    await cart.save();

    res.status(200).json({
      message: "Cart cleared successfully",
      cart: cart,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Error clearing cart" });
  }
});

export default router;
