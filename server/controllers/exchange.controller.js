import Book from "../models/Book.js";
import ExchangeRequest from "../models/Exchange.js";
import User from "../models/User.js";

const getExchanges = async (req, res) => {
    const userId = req.userId;

    try {
        const exchangeRequests = await ExchangeRequest.find()
            .populate({
                path: 'requestedBook',
                match: { owner: userId },
                populate: { path: 'owner', select: 'name' }
            })
            .populate('requester', 'name')
            .populate('offeredBook', 'title author')
            .sort({ createdAt: -1 });

        const filteredRequests = exchangeRequests.filter(req => req.requestedBook !== null);

        res.send(filteredRequests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch incoming exchange requests', details: error.message });
    }
};

const getSentExchanges = async (req, res) => {
    const userId = req.userId;

    try {
        const userRequests = await ExchangeRequest.find({ requester: userId })
            .populate('requestedBook', 'title author')
            .populate('offeredBook', 'title author')
            .populate('requester', 'name')
            .sort({ createdAt: -1 });

        res.send(userRequests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch outgoing exchange requests', details: error.message });
    }
};

const acceptExchange = async (req, res) => {
    const { exchangeId } = req.params;
    const userId = req.userId;

    try {
        const exchangeRequest = await ExchangeRequest.findById(exchangeId)
            .populate('requester')
            .populate('requestedBook')
            .populate('offeredBook');

        if (!exchangeRequest) {
            return res.status(404).json({ error: 'Exchange request not found' });
        }

        const { requester, requestedBook, offeredBook } = exchangeRequest;

        if (requester._id.toString() === userId) {
            return res.status(403).json({ error: 'You cannot accept your own request' });
        }

        if (exchangeRequest.status !== 'pending') {
            return res.status(400).json({ error: 'Exchange request is not pending' });
        }

        if (requestedBook.owner.toString() !== userId) {
            return res.status(403).json({ error: 'You are not authorized to accept this exchange' });
        }

        exchangeRequest.status = 'accepted';

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await exchangeRequest.save({ session });

            await User.updateMany(
                { _id: { $in: [requester._id, userId] } },
                {$pull: {books: { $in: [requestedBook._id,      
                                offeredBook._id] }},
                $push: {books: { $each: [requestedBook._id, offeredBook._id] }}},
                { session }
            );

            await Book.updateMany(
                { _id: { $in: [requestedBook._id, offeredBook._id] } },
                {$set: {owner: {$cond: [
                                { $eq: ['$_id', requestedBook._id] },
                                userId,
                                requester._id]
                        }}},
                { session }
            );

            await ExchangeRequest.updateMany(
                {
                    $or: [
                        { requestedBook: requestedBook._id },
                        { offeredBook: requestedBook._id },
                        { requestedBook: offeredBook._id },
                        { offeredBook: offeredBook._id }
                    ],
                    status: 'pending',
                    _id: { $ne: exchangeId }
                },
                { status: 'rejected' },
                { session }
            );
            await session.commitTransaction();
            session.endSession();
            res.json({ message: 'Exchange request accepted', exchangeRequest });
        } catch (updateManyError) {
            console.error('Error updating other exchange requests:', updateManyError);
            return res.status(500).json({ error: 'Failed to update other exchange requests', details: updateManyError.message });
        }
    } catch (error) {
        console.error('Error accepting exchange request:', error);
        res.status(500).json({ error: 'Failed to accept exchange request', details: error.message });
    }
};

const declineExchange = async (req, res) => {
    const { exchangeId } = req.params;
    const userId = req.userId;

    try {
        const exchangeRequest = await ExchangeRequest.findById(exchangeId)
            .populate('requester')
            .populate('requestedBook')
            .populate('offeredBook');

        if (!exchangeRequest) {
            return res.status(404).json({ error: 'Exchange request not found' });
        }

        const { requester, requestedBook } = exchangeRequest;

        if (requester._id.toString() === userId) {
            return res.status(403).json({ error: 'You cannot decline your own request' });
        }

        if (requestedBook.owner.toString() !== userId) {
            return res.status(403).json({ error: 'You are not authorized to decline this exchange' });
        }

        if (exchangeRequest.status !== 'pending') {
            return res.status(400).json({ error: 'Exchange request is not pending' });
        }

        exchangeRequest.status = 'rejected';
        await exchangeRequest.save();

        res.json({ message: 'Exchange request rejected', exchangeRequest });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reject exchange request', details: error.message });
    }
};

const postExchange = async (req, res) => {
    const { requestedBookId, offeredBookId } = req.body;
    const requesterId = req.userId;

    try {
        const requestedBook = await Book.findById(requestedBookId);
        const offeredBook = await Book.findById(offeredBookId);
        const requester = await User.findById(requesterId);

        if (!requestedBook || !offeredBook) {
            return res.status(404).json({ error: 'Book not found' });
        }

        if (requestedBook.owner.toString() === offeredBook.owner.toString()) {
            return res.status(400).json({ error: 'You cannot exchange books with yourself' });
        }

        if (offeredBook.owner.toString() !== requesterId) {
            return res.status(403).json({ error: 'You do not own the requested book' });
        }
        
        const requestData = {
            requester: requesterId,
            requestedBook: requestedBookId,
            offeredBook: offeredBookId,
            status: 'pending'
        }
        const existingRequest = await ExchangeRequest.findOne(requestData)
        if (existingRequest) return res.status(404).json({
            error: 'A similar pending exchange request already exists'
        })
        
        const exchangeRequest = new ExchangeRequest(requestData);

        await exchangeRequest.save();
        res.status(201).json({ message: 'Exchange request created', exchangeRequest });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

export default { getExchanges, getSentExchanges, acceptExchange, declineExchange, postExchange };