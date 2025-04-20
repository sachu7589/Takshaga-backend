const express = require('express');
const router = express.Router();
const Estimate = require('../models/Estimate');

// Create a new estimate
// http://localhost:3000/api/estimates/create
router.post('/create', async (req, res) => {
  try {
    // Get the count of existing estimates and generate a new estimate number
    const count = await Estimate.countDocuments();
    const estimateNumber = (count + 1).toString();
    
    // Create the estimate with the generated estimate number
    const estimateData = {
      ...req.body,
      estimateNumber: estimateNumber
    };
    
    const estimate = new Estimate(estimateData);
    await estimate.save();
    
    // Update the client's stage to 1
    const Client = require('../models/client');
    await Client.findByIdAndUpdate(
      estimate.clientId,
      { stage: 1 },
      { new: true }
    );
    
    res.status(201).json({
      success: true,
      data: estimate,
      estimateId: estimate._id,
      clientId: estimate.clientId
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get estimate by ID
// http://localhost:3000/api/estimates/:id
router.get('/:id', async (req, res) => {
  try {
    const estimate = await Estimate.findById(req.params.id);
    if (!estimate) {
      return res.status(404).json({
        success: false,
        error: 'Estimate not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: estimate
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get estimate by client ID
// http://localhost:3000/api/estimates/client/:clientId
router.get('/client/:clientId', async (req, res) => {
  try {
    const estimates = await Estimate.find({ clientId: req.params.clientId });
    
    if (!estimates || estimates.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No estimates found for this client'
      });
    }
    
    // Only return the estimate IDs
    const estimateIds = estimates.map(estimate => estimate._id);
    
    res.status(200).json({
      success: true,
      count: estimates.length,
      data: estimateIds
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get grandTotal by client ID
// http://localhost:3000/api/estimates/client/:clientId/grandTotal
router.get('/client/:clientId/grandTotal', async (req, res) => {
  try {
    const estimates = await Estimate.find({ clientId: req.params.clientId });
    
    if (!estimates || estimates.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No estimates found for this client'
      });
    }
    
    // Return just the grandTotal values for each estimate
    const grandTotals = estimates.map(estimate => estimate.grandTotal);
    
    res.status(200).json({
      success: true,
      clientId: req.params.clientId,
      grandTotals: grandTotals
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Update estimate grandTotal by ID
// http://localhost:3000/api/estimates/updateGrandTotal/:id
router.put('/updateGrandTotal/:id', async (req, res) => {
  try {
    const { grandTotal } = req.body;
    
    if (!grandTotal && grandTotal !== 0) {
      return res.status(400).json({
        success: false,
        error: 'Grand total value is required'
      });
    }
    
    const estimate = await Estimate.findByIdAndUpdate(
      req.params.id,
      { grandTotal },
      { new: true }
    );
    
    if (!estimate) {
      return res.status(404).json({
        success: false,
        error: 'Estimate not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: estimate
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Update an estimate by ID
// http://localhost:3000/api/estimates/update/:id
router.put('/update/:id', async (req, res) => {
  try {
    const { estimateNumber, clientId, clientName, materials, grandTotal, status } = req.body;
    
    const estimate = await Estimate.findByIdAndUpdate(
      req.params.id,
      { estimateNumber, clientId, clientName, materials, grandTotal, status },
      { new: true }
    );
    
    if (!estimate) {
      return res.status(404).json({
        success: false,
        error: 'Estimate not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: estimate
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});



module.exports = router; 