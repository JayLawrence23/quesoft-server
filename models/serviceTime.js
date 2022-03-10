import mongoose from 'mongoose';

const serviceTimeSchema = mongoose.Schema({
    servName: { type: String, required: true },
    servingTime: { type: Date }
});

export default mongoose.model('ServiceTime', serviceTimeSchema);
