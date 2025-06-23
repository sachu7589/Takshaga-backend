const express = require('express');
const router = express.Router();
const ClientExpense = require('../models/clientExpense');
const { authenticateToken } = require('../middleware/auth');

// Create a new client expense
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { clientId, userId, amount, purpose, notes } = req.body;  // Destructure notes from req.body
        const newExpense = new ClientExpense({
            clientId,
            userId,
            amount,
            purpose,
            notes: notes || null  // Set notes to null if it's undefined
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
