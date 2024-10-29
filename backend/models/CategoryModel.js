const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    key: {
        type: String,
        required: [true, 'Please add a category key'],
        trim: true,
        lowercase: true
    },
    label: {
        type: String,
        required: [true, 'Please add a category label'],
        trim: true
    },
    icon: {
        type: String,
        default: 'circle'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

// Create compound index for user and key to prevent duplicates
CategorySchema.index({ user: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('Category', CategorySchema);