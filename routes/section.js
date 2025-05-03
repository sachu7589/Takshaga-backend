const express = require('express');
const router = express.Router();
const Section = require('../models/section');

// Create a new section
router.post('/create', async (req, res) => {
    try {
        const section = new Section(req.body);
        await section.save();
        res.status(201).json({
            success: true,
            message: 'Section created successfully',
            data: section
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating section',
            error: error.message
        });
    }
});

// Get all sections
router.get('/list', async (req, res) => {
    try {
        const sections = await Section.find({ status: 1 });
        res.status(200).json({
            success: true,
            data: sections
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching sections',
            error: error.message
        });
    }
});

// Get section by ID
router.get('/:id', async (req, res) => {
    try {
        const section = await Section.findById(req.params.id);
        if (!section) {
            return res.status(404).json({
                success: false,
                message: 'Section not found'
            });
        }
        res.status(200).json({
            success: true,
            data: section
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching section',
            error: error.message
        });
    }
});

// Update section
router.put('/:id', async (req, res) => {
    try {
        const section = await Section.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!section) {
            return res.status(404).json({
                success: false,
                message: 'Section not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Section updated successfully',
            data: section
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating section',
            error: error.message
        });
    }
});

module.exports = router; 