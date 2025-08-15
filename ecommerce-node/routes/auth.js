import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// REGISTER
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const passwordRegex = /^(?=.*\d)(?=.*[@]).+$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Password must contain at least one number and one special character.",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({ firstName, lastName, email, passwordHash });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required." });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "dev_secret",
      {
        expiresIn: "1h",
      }
    );

    res
      .status(200)
      .json({ message: "Login successful!", token, user_id: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET CURRENT USER
router.get("/me", authMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE USER
// UPDATE USER route - modify to handle all address fields consistently
router.post("/user/update", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { firstName, lastName, birthdate, phoneNumber, address } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update basic fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (birthdate !== undefined) user.birthdate = new Date(birthdate);
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

    // Update address fields - ensure all fields are handled
    if (address) {
      user.address = user.address || {}; // Initialize if doesn't exist
      if (address.street !== undefined) user.address.street = address.street;
      if (address.city !== undefined) user.address.city = address.city;
      if (address.state !== undefined) user.address.state = address.state;
      if (address.region !== undefined) user.address.state = address.region; // Map region to state
      if (address.zipCode !== undefined) user.address.zipCode = address.zipCode;
      if (address.postalCode !== undefined)
        user.address.zipCode = address.postalCode; // Map postalCode to zipCode
    }

    await user.save();

    // Return the updated user data including address
    const updatedUser = await User.findById(userId).select("-passwordHash");
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export { authMiddleware }; // Export middleware separately
export default router;
