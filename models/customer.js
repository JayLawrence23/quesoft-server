import mongoose from 'mongoose';

const customerSchema = mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    mobile: { type: String },
    email: { type: String },
    otp: { type: String },
    transactionId: { type: String },
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
