const express = require('express');
const router = express.Router();
const ClientExpense = require('../models/clientExpense');

// Create a new client expense
router.post('/', async (req, res) => {
    try {
        const { clientId, userId, amount, purpose } = req.body;
        const newExpense = new ClientExpense({
            clientId,
            userId,
            amount,
            purpose
        });
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all expenses for a specific client
router.get('/client/:clientId', async (req, res) => {
    try {
        const expenses = await ClientExpense.find({ clientId: req.params.clientId })
            .sort({ date: -1 }); // Sort by date in descending order
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
