import mongoose from 'mongoose';

const counterSchema = mongoose.Schema({
    cName: { type: String, required: true },
    service: { type: String },
    servedTicket: [],
    curStaffName: { type: String },
    status: { type: Boolean, default: false },
    nowServing: { type: Boolean },
    currentTicNo: { type: String },
    business: { type: String },
});

export default mongoose.model('Counter', counterSchema);
