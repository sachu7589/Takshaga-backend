const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    phoneNumber: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    typeOfWork: {
        type: String,
        required: true
    },
    stage: {
        type: Number,
        default: 0
    },
    completed: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

// Check if the model already exists to prevent "Cannot overwrite model" error
module.exports = mongoose.models.Client || mongoose.model('Client', clientSchema);
