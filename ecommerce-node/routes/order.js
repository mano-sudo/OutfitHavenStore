import express from "express";
import Order from "../models/Order.js";
import { authMiddleware } from "./auth.js";

const router = express.Router();

// Apply auth middleware to all order routes
router.use(authMiddleware);

// Create new order
router.post("/", async (req, res) => {
  try {
    const { items, shippingInfo, total } = req.body;
    const userId = req.userId; // From auth middleware

    // Validate request data
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must contain items" });
    }

    const order = new Order({
      user: userId,
      items: items.map((item) => ({
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingInfo: {
        ...shippingInfo,
        // Ensure consistent field names
        phone: shippingInfo.phone || shippingInfo.phoneNumber,
      },
      total,
      status: "pending",
    });

    const savedOrder = await order.save();

    // Populate some fields for the response
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate("user", "firstName lastName email")
      .populate("items.productId", "name images");

    res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
});

// Get all orders for a user
router.get("/", async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ user: userId })
      .populate("user", "firstName lastName email")
      .populate("items.productId", "name images price")
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

export default router;
