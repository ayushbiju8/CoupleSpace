import mongoose, { Schema } from 'mongoose';

const invitationSchema = new mongoose.Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiverEmail: {
        type: String,
        required: true,
    },
    coupleId: {
        type: Schema.Types.ObjectId,
        ref: 'Couple',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    expiration: {
        type: Date,
        required: true,
    },
}, { timestamps: true });


export const Invitation = mongoose.model('Invitation', invitationSchema);
