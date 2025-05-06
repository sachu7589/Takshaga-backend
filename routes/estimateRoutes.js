const express = require('express');
const router = express.Router();
const Estimate = require('../models/estimate.js');
const Client = require('../models/client');

// Create a new estimate
// http://localhost:3000/api/estimates/insert
router.post('/insert', async (req, res) => {
    try {
        const { 
            clientId, 
            clientName, 
            name, 
            discount, 
            sections, 
            total, 
            grandTotal, 
            status 
        } = req.body;
        
        const estimate = new Estimate({
            clientId,
            clientName,
            name,
            discount,
            sections,
            total,
            grandTotal,
            status
        });
        
        await estimate.save();
        
        // Update client stage to 1 after creating estimate
        try {
            const updatedClient = await Client.findByIdAndUpdate(clientId, { stage: 1 }, { new: true });
            if (!updatedClient) {
                console.log('Client not found for ID:', clientId);
            }
        } catch (clientError) {
            console.error('Error updating client stage:', clientError);
            // Continue with response even if client update fails
        }
        
        res.status(201).json({ id: estimate._id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all estimates
// http://localhost:3000/api/estimates/display
router.get('/display', async (req, res) => {
    try {
        const estimates = await Estimate.find().populate('clientId');
        res.json(estimates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single estimate by ID
// http://localhost:3000/api/estimates/display/:id
router.get('/display/:id', async (req, res) => {
    try {
        const estimate = await Estimate.findById(req.params.id).populate('clientId');
        if (!estimate) {
            return res.status(404).json({ message: 'Estimate not found' });
        }
        res.json(estimate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get estimates by client ID
// http://localhost:3000/api/estimates/client/:clientId
router.get('/client/:clientId', async (req, res) => {
    try {
        const estimates = await Estimate.find({ clientId: req.params.clientId });
        res.json(estimates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get grandTotal of the estimate for a client
// http://localhost:3000/api/estimates/client/:clientId/grandTotal
router.get('/client/:clientId/grandTotal', async (req, res) => {
    try {
        // Since one client has only one estimate, we can use findOne instead of find
        const estimate = await Estimate.findOne({ clientId: req.params.clientId });
        if (!estimate) {
            return res.json({ grandTotal: 0 });
        }
        
        // Return the grandTotal directly from the single estimate
        res.json({ grandTotal: estimate.grandTotal, clientId: req.params.clientId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an estimate by ID
// http://localhost:3000/api/estimates/update/:id
router.put('/update/:id', async (req, res) => {
    try {
        const { 
            clientId, 
            clientName, 
            name, 
            discount, 
            sections, 
            total, 
            grandTotal 
        } = req.body;
        
        const estimate = await Estimate.findByIdAndUpdate(
            req.params.id,
            { 
                clientId, 
                clientName, 
                name, 
                discount, 
                sections, 
                total, 
                grandTotal 
            },
            { new: true }
        );
        
        if (!estimate) {
            return res.status(404).json({ message: 'Estimate not found' });
        }
        res.json(estimate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update estimate status by ID
// http://localhost:3000/api/estimates/status/:id
router.put('/status/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const estimate = await Estimate.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (!estimate) {
            return res.status(404).json({ message: 'Estimate not found' });
        }
        res.json(estimate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 