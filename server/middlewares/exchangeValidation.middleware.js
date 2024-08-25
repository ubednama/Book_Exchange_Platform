import mongoose from 'mongoose';

const validateExchangeRequest = (req, res, next) => {
    const { requestedBook, offeredBook } = req.body;

    if (!mongoose.Types.ObjectId.isValid(requestedBook)) {
        return res.status(400).json({ error: 'Invalid requested book ID' });
    }

    if (!mongoose.Types.ObjectId.isValid(offeredBook)) {
        return res.status(400).json({ error: 'Invalid offered book ID' });
    }

    if (requestedBook === offeredBook) {
        return res.status(400).json({ error: 'Requested book and offered book cannot be the same' });
    }

    next();
}

export default validateExchangeRequest;