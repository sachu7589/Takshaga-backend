const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['employee', 'admin'],
        default: 'employee'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
