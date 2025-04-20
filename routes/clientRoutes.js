const express = require('express');
const router = express.Router();
const Client = require('../models/client');

// Create a new client
// http://localhost:3000/api/clients/insert
router.post('/insert', async (req, res) => {
    try {
        const { clientName, email, phoneNumber, location, typeOfWork } = req.body;
        const client = new Client({
            clientName,
            email,
            phoneNumber,
            location,
            typeOfWork
        });
        await client.save();
        res.status(201).json({ id: client._id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all clients
// http://localhost:3000/api/clients/display
router.get('/display', async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single client by ID
// http://localhost:3000/api/clients/display/:id
router.get('/display/:id', async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a client by ID
// http://localhost:3000/api/clients/update/:id
router.put('/update/:id', async (req, res) => {
    try {
        const { clientName, email, phoneNumber, location, typeOfWork, stage, completed } = req.body;
        const client = await Client.findByIdAndUpdate(
            req.params.id,
            { clientName, email, phoneNumber, location, typeOfWork, stage, completed },
            { new: true }
        );
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(client);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update client status by ID
// http://localhost:3000/api/clients/status/:id
router.put('/status/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const client = await Client.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(client);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


module.exports = router; 