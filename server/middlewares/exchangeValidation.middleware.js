import mongoose from 'mongoose';

const validateExchangeRequest = (req, res, next) => {
    const { requestedBookId, offeredBookId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(requestedBookId)) {
        return res.status(400).json({ error: 'Invalid requested book ID' });
    }

    if (!mongoose.Types.ObjectId.isValid(offeredBookId)) {
        return res.status(400).json({ error: 'Invalid offered book ID' });
    }

    if (requestedBookId === offeredBookId) {
        return res.status(400).json({ error: 'Requested book and offered book cannot be the same' });
    }

    next();
}

export default validateExchangeRequest;