const express = require('express');
const router = express.Router();
const Stage = require('../models/stage');

// Create a new stage
router.post('/', async (req, res) => {
    try {
        const { clientId, note } = req.body;
        
        if (!clientId || !note) {
            return res.status(400).json({ message: 'Client ID and note are required' });
        }

        const stage = new Stage({
            clientId,
            note
        });

        const savedStage = await stage.save();
        res.status(201).json(savedStage);
    } catch (error) {
        res.status(500).json({ message: 'Error creating stage', error: error.message });
    }
});

// Get stages by client ID
router.get('/client/:clientId', async (req, res) => {
    try {
        const { clientId } = req.params;
        const stages = await Stage.find({ clientId }).populate('clientId');
        res.json(stages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stages for client', error: error.message });
    }
});

// Update stage by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { note } = req.body;

        if (!note) {
            return res.status(400).json({ message: 'Note is required' });
        }

        const updatedStage = await Stage.findByIdAndUpdate(
            id,
            { note },
            { new: true }
        ).populate('clientId');

        if (!updatedStage) {
            return res.status(404).json({ message: 'Stage not found' });
        }

        res.json(updatedStage);
    } catch (error) {
        res.status(500).json({ message: 'Error updating stage', error: error.message });
    }
});

module.exports = router;
