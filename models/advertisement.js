import mongoose from 'mongoose';

const advertiseSchema = mongoose.Schema({
    adsTitle: { type: String, required: true },
    adsDesc: { type: String, required: true },
    adsPhoto: { type: String, },
    adsVid: { type: String },
    business: { type: String }, 
    createdAt: {
        type: Date,
        default: new Date()
    },
}, { timestamp: true });

// const UserSchema = mongoose.model('User', userSchema);

export default mongoose.model('advertisement', advertiseSchema);
