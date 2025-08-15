import express from "express";
import { sendOrderEmail } from "../services/emailService.js";

const router = express.Router();

/**
 * @route POST /api/send-order-email
 * @desc Send order confirmation email to customer and admin
 * @access Public (Consider adding auth middleware if needed)
 */
router.post("/send-order-email", async (req, res) => {
  try {
    const { to, subject, orderDetails } = req.body;

    // Validate required fields
    if (!orderDetails) {
      return res.status(400).json({
        success: false,
        message: "Order details are required",
      });
    }

    console.log("[Email Route] Received request to send order email");

    // Send to admin (outfithaven)
    const adminResult = await sendOrderEmail(
      "outfithaven@gmail.com",
      `[ADMIN COPY] ${subject || "New Order"}`,
      orderDetails
    );

    // Send to customer
    const customerEmail = to || orderDetails.customer?.email;
    if (!customerEmail) {
      console.warn("[Email Route] No customer email provided");
    } else {
      await sendOrderEmail(
        customerEmail,
        subject || "Your OutfitHaven Order Confirmation",
        orderDetails
      );
    }

    res.json({
      success: true,
      message: "Emails sent successfully",
      adminResult,
      customerEmail,
    });
  } catch (error) {
    console.error("[Email Route] Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send emails",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

export default router;
