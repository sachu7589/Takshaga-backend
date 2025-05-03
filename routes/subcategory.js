const express = require('express');
const router = express.Router();
const Subcategory = require('../models/Subcategory');

// Create a new subcategory
router.post('/insert', async (req, res) => {
    try {
        const subcategory = new Subcategory(req.body);
        await subcategory.save();
        res.status(201).json(subcategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all subcategories
router.get('/display', async (req, res) => {
    try {
        const subcategories = await Subcategory.find();
        res.json(subcategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single subcategory by ID
router.get('/display/:id', async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id);
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        res.json(subcategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a subcategory
router.put('/update/:id', async (req, res) => {
    try {
        const subcategory = await Subcategory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        res.json(subcategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 