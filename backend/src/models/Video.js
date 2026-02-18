const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    tag: String,
    views: { type: Number, default: 0 },
    isPremium: { type: Boolean, default: false },
    image: String, 
    videoUrl: { type: String, required: true },
    description: String
}, {
    timestamps: true 
});

VideoSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id  }
});

module.exports = mongoose.model('Video', VideoSchema);