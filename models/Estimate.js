const mongoose = require('mongoose');

const estimateSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    discount: {
        type: Number,
        default: 0
    },
    sections: [{
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
        material: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        measurements: [{
            length: {
                type: Number,
                required: true
            },
            breadth: {
                type: Number,
                required: true
            },
            area: {
                type: Number,
                required: true
            }
        }],
        unitPrice: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    grandTotal: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

const Estimate = mongoose.model('Estimate', estimateSchema);

module.exports = Estimate;
