const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    accountName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    ifscCode: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        required: true,
        enum: ['Savings', 'Current', 'Other']
    },
    upiId: {
        type: String,
        unique: true,
        sparse: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Bank', bankSchema);
