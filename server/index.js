const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Product'); // Assuming Product model is in 'models/Product.js'

// Check if Category model is already defined
const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({
  name: { type: String, required: true, unique: true },
}));

const app = express();
app.use(cors());
app.use(express.json()); // For parsing application/json

// Connect to MongoDB
mongoose.connect('mongodb+srv://22bca45:92827262@cluster0.xifci.mongodb.net/shivdb?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes

// GET all products
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// POST new product
app.post('/api/products', async (req, res) => {
  const { name, price, category } = req.body;
  const newProduct = new Product({ name, price, category });
  await newProduct.save();
  res.status(201).json(newProduct);
});

// PUT update product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, category } = req.body;
  const updatedProduct = await Product.findByIdAndUpdate(id, { name, price, category }, { new: true });
  res.json(updatedProduct);
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.json({ message: 'Product deleted' });
});


// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch all categories
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// Add a new category
app.post('/api/categories', async (req, res) => {
  const { category } = req.body;

  // Check if category name is provided
  if (!category) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  try {
    // Check if category already exists
    const existingCategory = await Category.findOne({ name: category });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    // Create a new category and save to the database
    const newCategory = new Category({ name: category });
    await newCategory.save();

    res.status(201).json({ message: `Category "${category}" created.` });
  } catch (error) {
    console.error('Error creating category:', error); // Log error to console for debugging
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
