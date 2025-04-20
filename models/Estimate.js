const mongoose = require('mongoose');

const estimateSchema = new mongoose.Schema({
  estimateNumber: {
    type: String,
    required: true,
    unique: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  materials: [{
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    measurementType: {
      type: String,
      required: true
    },
    dimensions: {
      type: Object,
      default: {}
    },
    price: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  }],
  grandTotal: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Estimate', estimateSchema); 