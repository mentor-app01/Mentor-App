const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Ad', AdSchema);