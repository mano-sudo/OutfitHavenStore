import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Validate environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  throw new Error("Email credentials not configured in environment variables");
}

console.log("[Email Service] Initializing with user:", process.env.EMAIL_USER);

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  // Remove tls.rejectUnauthorized in production
});

// Verify connection with retries
const verifyConnection = async (retries = 3) => {
  try {
    await transporter.verify();
    console.log("[Email Service] Server is ready to send emails");
    return true;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying connection (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return verifyConnection(retries - 1);
    }
    console.error("[Email Service] Connection error:", error);
    throw error;
  }
};

verifyConnection();

// Email sending with retry logic
const sendWithRetry = async (mailOptions, retries = 3) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `[Email Service] Email sent to ${mailOptions.to}`,
      info.messageId
    );
    return info;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying email send (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return sendWithRetry(mailOptions, retries - 1);
    }
    throw error;
  }
};

export const sendOrderEmail = async (to, subject, orderDetails) => {
  try {
    console.log(`[Email Service] Preparing email to: ${to}`);

    // Validate order details
    if (!orderDetails?.items) {
      throw new Error("Invalid order details: missing items");
    }

    // Format email content
    const itemsHtml = orderDetails.items
      .map(
        (item) => `
      <tr>
        <td>${item.name || "No name"} (${item.size || "N/A"})</td>
        <td>${item.quantity || 0}</td>
        <td>₱${item.price ? item.price.toLocaleString() : "0"}</td>
        <td>₱${item.total ? item.total.toLocaleString() : "0"}</td>
      </tr>
    `
      )
      .join("");

    const textContent =
      `Order Confirmation #${orderDetails.orderId || "N/A"}\n\n` +
      `Customer: ${orderDetails.customer?.name || "N/A"}\n` +
      `Email: ${orderDetails.customer?.email || "N/A"}\n` +
      `Phone: ${orderDetails.customer?.phone || "N/A"}\n` +
      `Address: ${orderDetails.customer?.address || "N/A"}\n\n` +
      `Items:\n${orderDetails.items
        .map(
          (i) =>
            `- ${i.name || "No name"} (${i.size || "N/A"}) x${
              i.quantity || 0
            } ₱${i.price ? i.price.toLocaleString() : "0"}`
        )
        .join("\n")}\n\n` +
      `Subtotal: ₱${orderDetails.subtotal?.toLocaleString() || "0"}\n` +
      `Shipping: ₱${orderDetails.shipping?.toLocaleString() || "0"}\n` +
      `Total: ₱${orderDetails.total?.toLocaleString() || "0"}\n\n` +
      `Thank you for shopping with OutfitHaven!`;

    const mailOptions = {
      from: `OutfitHaven <${process.env.EMAIL_USER}>`,
      to,
      subject:
        subject || `Order Confirmation #${orderDetails.orderId || "N/A"}`,
      text: textContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Order Confirmation</h1>
          <h2>Order #${orderDetails.orderId || "Pending"}</h2>
          
          <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 8px;">Customer Details</h3>
          <p><strong>Name:</strong> ${orderDetails.customer?.name || "N/A"}</p>
          <p><strong>Email:</strong> ${
            orderDetails.customer?.email || "N/A"
          }</p>
          <p><strong>Phone:</strong> ${
            orderDetails.customer?.phone || "N/A"
          }</p>
          <p><strong>Address:</strong> ${
            orderDetails.customer?.address || "N/A"
          }</p>
          
          <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 8px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Product</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Qty</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Price</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; font-size: 16px;">
            <p><strong>Subtotal:</strong> ₱${
              orderDetails.subtotal?.toLocaleString() || "0"
            }</p>
            <p><strong>Shipping:</strong> ₱${
              orderDetails.shipping?.toLocaleString() || "0"
            }</p>
            <p style="font-weight: bold; font-size: 18px;">
              <strong>Total:</strong> ₱${
                orderDetails.total?.toLocaleString() || "0"
              }
            </p>
          </div>
          
          <p style="margin-top: 30px; color: #6b7280;">
            Thank you for shopping with OutfitHaven!
          </p>
        </div>
      `,
    };

    // Send email with retry
    const info = await sendWithRetry(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
      to,
      subject,
    };
  } catch (error) {
    console.error("[Email Service] Error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
