import mongoose from 'mongoose';

const ExchangeRequestSchema = new mongoose.Schema({
    requester: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }, requestedBook: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book',
        required: true
    }, offeredBook: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book',
        required: true
    }, status: { 
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending' 
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    offeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('ExchangeRequest', ExchangeRequestSchema);