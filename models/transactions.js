import mongoose from 'mongoose';

const transactionSchema = mongoose.Schema({
    code: { type: String },
    service: { type: String },
    ticketNo: { type: String },
    predWait: { type: Number },
    counterName: { type: String },
    monitor: { type: Boolean, default: false },
    contact: { type: String, default: null },
    email: { type: String, default: null },
    missed: { type: String },
    tags: [String],
    business: { type: String },
    issuedTime: {  
        type: Date,
        default: Date.now
    },
    calledTime: { type: Date },
    status: {
        type: String,
        default: 'Waiting'
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
}, { timestamp: true });

// const UserSchema = mongoose.model('User', userSchema);

export default mongoose.model('Transaction', transactionSchema);
