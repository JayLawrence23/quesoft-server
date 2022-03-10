import mongoose from 'mongoose';

const customerSchema = mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    status: {
        type: String,
        default: 'Active'
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
}, { timestamp: true });

// const UserSchema = mongoose.model('User', userSchema);

export default mongoose.model('Customer', customerSchema);
