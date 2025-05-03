const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    materialName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    subcategory: {
        type: String,
        required: true,
        trim: true
    },
    unitType: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

const Section = mongoose.model('Section', sectionSchema);

module.exports = Section; 