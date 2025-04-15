const express = require('express');
const router = express.Router();
const Material = require('../models/material');

// Create a new material
// http://localhost:3000/api/materials/insert
router.post('/insert', async (req, res) => {
    try {
        const material = new Material(req.body);
        await material.save();
        res.status(201).json(material);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all materials
// http://localhost:3000/api/materials/display
router.get('/display', async (req, res) => {
    try {
        const materials = await Material.find({ status: 1 }).populate('category');
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single material by ID
// http://localhost:3000/api/materials/:id
router.get('/:id', async (req, res) => {
    try {
        const material = await Material.findById(req.params.id).populate('category');
        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }
        res.json(material);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a material
// http://localhost:3000/api/materials/update/:id
router.put('/update/:id', async (req, res) => {
    try {
        const material = await Material.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('category');
        
        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }
        res.json(material);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 