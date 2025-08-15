import express from "express";
import Category from "../models/Category.js";

// Create the category router
const router = express.Router();

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single category by link
router.get("/link/:categoryLink", async (req, res) => {
  try {
    const category = await Category.findOne({
      link: req.params.categoryLink,
    }).populate("products");
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category); // This will include the products in the response
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE new category
router.post("/", async (req, res) => {
  const { title, image, link, colSpan, rowSpan } = req.body;
  const category = new Category({ title, image, link, colSpan, rowSpan });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE category
router.put("/:id", async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE category
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
