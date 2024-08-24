import mongoose from 'mongoose';

const ExchangeRequestSchema = new mongoose.Schema({
    requester: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }, requestedBook: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book' 
    }, offeredBook: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book' 
    }, status: { 
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending' 
    },
});

export default mongoose.model('ExchangeRequest', ExchangeRequestSchema);