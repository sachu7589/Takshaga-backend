const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    subcategoryName: {
        type: String,
        required: true,
        trim: true
    },
    categoryName: {
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

module.exports = mongoose.model('Subcategory', subcategorySchema); 