const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const { authenticateToken } = require('../middleware/auth');

// Get all categories
// http://localhost:3000/api/categories/display
router.get('/display', async (req, res) => {
    try {
        const categories = await Category.find({ status: 1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Insert a new category
// http://localhost:3000/api/categories/insert
router.post('/insert', authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;
        
        // Check if category with same name already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category with this name already exists' });
        }

        const category = new Category({
            name
        });

        const savedCategory = await category.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a category by ID
// http://localhost:3000/api/categories/update/:id
router.put('/update/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        // Check if category exists
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if new name already exists for other categories
        if (name && name !== category.name) {
            const existingCategory = await Category.findOne({ name });
            if (existingCategory) {
                return res.status(400).json({ message: 'Category with this name already exists' });
            }
        }

        // Update category
        if (name) category.name = name;
        if (status !== undefined) category.status = status;

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 