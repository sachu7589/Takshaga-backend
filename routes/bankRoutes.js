const express = require('express');
const router = express.Router();
const Bank = require('../models/bank');

// Display all banks
// http://localhost:3000/api/banks/display
router.get('/display', async (req, res) => {
    try {
        const banks = await Bank.find().populate('userId');
        res.json(banks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Insert new bank
router.post('/', async (req, res) => {
    try {
        const { userId, bankName, accountName, accountNumber, ifscCode, accountType, upiId } = req.body;
        
        // Check if account number already exists
        const existingAccount = await Bank.findOne({ accountNumber });
        if (existingAccount) {
            return res.status(400).json({ message: 'Account number already exists' });
        }

        // Check if UPI ID already exists (if provided)
        if (upiId) {
            const existingUPI = await Bank.findOne({ upiId });
            if (existingUPI) {
                return res.status(400).json({ message: 'UPI ID already exists' });
            }
        }

        const bank = new Bank({
            userId,
            bankName,
            accountName,
            accountNumber,
            ifscCode,
            accountType,
            upiId
        });

        const savedBank = await bank.save();
        const populatedBank = await Bank.findById(savedBank._id).populate('userId', 'name email');
        res.status(201).json(populatedBank);
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            res.status(400).json({ message: `${field} already exists` });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
});

// Update bank
router.put('/:id', async (req, res) => {
    try {
        const { bankName, accountName, accountNumber, ifscCode, accountType, upiId } = req.body;
        
        // Check if account number already exists (excluding current record)
        if (accountNumber) {
            const existingAccount = await Bank.findOne({ 
                accountNumber, 
                _id: { $ne: req.params.id } 
            });
            if (existingAccount) {
                return res.status(400).json({ message: 'Account number already exists' });
            }
        }

        // Check if UPI ID already exists (excluding current record)
        if (upiId) {
            const existingUPI = await Bank.findOne({ 
                upiId, 
                _id: { $ne: req.params.id } 
            });
            if (existingUPI) {
                return res.status(400).json({ message: 'UPI ID already exists' });
            }
        }

        const updatedBank = await Bank.findByIdAndUpdate(
            req.params.id,
            { bankName, accountName, accountNumber, ifscCode, accountType, upiId },
            { new: true, runValidators: true }
        ).populate('userId', 'name email');

        if (!updatedBank) {
            return res.status(404).json({ message: 'Bank not found' });
        }

        res.json(updatedBank);
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            res.status(400).json({ message: `${field} already exists` });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
});

// Delete bank
router.delete('/:id', async (req, res) => {
    try {
        const deletedBank = await Bank.findByIdAndDelete(req.params.id);
        if (!deletedBank) {
            return res.status(404).json({ message: 'Bank not found' });
        }
        res.json({ message: 'Bank deleted successfully', bank: deletedBank });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
