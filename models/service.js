import mongoose from 'mongoose';

const serviceSchema = mongoose.Schema({
    servName: { type: String, required: true },
    prefix: { type: String, required: true },
    desc: { type: String },
    aveServTime: { type: Number },
    ticketNo: [],
    tags: [String],
    queuingTic: [],
    counters: [],
    business: { type: String },
    status: {
        type: String,
        default: 'Active'
    },
}, { timestamp: true });

export default mongoose.model('Service', serviceSchema);
