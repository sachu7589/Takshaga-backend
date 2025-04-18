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
    }
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
