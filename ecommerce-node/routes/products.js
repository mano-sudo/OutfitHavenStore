import express from "express";
import Product from "../models/Products.js";
import Category from "../models/Category.js"; // Ensure the Category model is imported

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ADD a new product
router.post("/add", async (req, res) => {
  const { name, categoryLink, brand, price, images, sizes, description } =
    req.body;

  console.log("Received data:", req.body);

  if (
    !name ||
    !categoryLink ||
    !brand ||
    !price ||
    !images ||
    !sizes ||
    !description
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Find the category by link
    const category = await Category.findOne({ link: categoryLink });

    if (!category) {
      return res
        .status(400)
        .json({ error: `Category with link ${categoryLink} not found` });
    }

    // Create the new product with the category ID
    const newProduct = new Product({
      name,
      category: category._id, // Assign category _id to the product
      brand,
      price,
      images,
      sizes,
      description,
    });

    // Save the new product
    await newProduct.save();

    // After the product is saved, push the product's ID to the category's products array
    category.products.push(newProduct._id);
    await category.save();

    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// GET single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE product by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE product by ID
router.put("/:id", async (req, res) => {
  const { name, category, brand, price, images, sizes, description } = req.body;

  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, brand, price, images, sizes, description },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json({ success: true, product: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all products by category ID
router.get("/category/:categoryId", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
