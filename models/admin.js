import mongoose from 'mongoose';

const adminSchema = mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    contact: { type: String, },
    email: { type: String, required: true },
    secemail: { type: String, required: true },
    password: { type: String, required: true },
    business: { type: String, default: "others" },
    createdAt: {
        type: Date,
        default: new Date()
    },
}, { timestamp: true });

// const UserSchema = mongoose.model('User', userSchema);

export default mongoose.model('Admin', adminSchema);
