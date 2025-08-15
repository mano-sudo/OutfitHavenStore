import express from "express";
import Slider from "../models/Slider.js"; // add .js extension for ES modules

const router = express.Router();

// GET all sliders
router.get("/", async (req, res) => {
  try {
    const sliders = await Slider.find();
    res.json(sliders);
  } catch (err) {
    console.error("Error fetching sliders:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ADD a new slider
router.post("/add", async (req, res) => {
  const { images } = req.body;

  if (!images) {
    return res.status(400).json({ error: "Required to put images" });
  }

  try {
    const newSlider = new Slider({ images });
    await newSlider.save();
    res.status(201).json({ success: true, slider: newSlider });
  } catch (err) {
    console.error("Error adding slider:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// DELETE slider by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Slider.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Slider not found" });
    res.json({ success: true, message: "Slider deleted" });
  } catch (err) {
    console.error("Error deleting slider:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE slider by ID
router.put("/:id", async (req, res) => {
  const { images } = req.body;
  if (!images) return res.status(400).json({ error: "Images are required" });

  try {
    const updated = await Slider.findByIdAndUpdate(
      req.params.id,
      { images },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Slider not found" });
    res.json({ success: true, slider: updated });
  } catch (err) {
    console.error("Error updating slider:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
