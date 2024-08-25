import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    }, author: { 
        type: String, 
        required: true 
    }, genre: { 
        type: String, 
        required: true 
    }, description: {
        type: String,
        required: false
    }, owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
});

export default mongoose.model('Book', BookSchema);