const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    plan: { type: String, enum: ['free', 'premium'], default: 'free' }
});

// Removido o 'next' dos parâmetros e da execução, deixando apenas o async/await
UserSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);