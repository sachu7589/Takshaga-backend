const express = require('express');
const router = express.Router();
const ClientPayment = require('../models/clientPayment');

// Create a new client payment
router.post('/', async (req, res) => {
    try {
        const payment = new ClientPayment(req.body);
        const savedPayment = await payment.save();
        res.status(201).json(savedPayment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all payments for a specific client
router.get('/client/:clientId', async (req, res) => {
    try {
        const payments = await ClientPayment.find({ clientId: req.params.clientId });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a payment by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedPayment = await ClientPayment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.json(updatedPayment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
