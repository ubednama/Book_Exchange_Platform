import mongoose from "mongoose";
import Book from "../models/Book.js";
import ExchangeRequest from "../models/Exchange.js";
import User from "../models/User.js";

const getExchanges = async (req, res) => {
    const userId = req.userId;

    try {
        const exchangeRequests = await ExchangeRequest.find({ requestedTo: userId })
            .populate({
                path: 'requestedBook',
                populate: { path: 'owner', select: 'username' }
            })
            .populate('requester', 'username')
            .populate('requestedTo', 'username')
            .populate('offeredBook', 'title author')
            .sort({ createdAt: -1 });

        console.log("exchange requests", exchangeRequests);

        res.send(exchangeRequests);
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
            .populate('requester', 'username')
            .populate('requestedTo', 'username')
            .sort({ createdAt: -1 });

            console.log("userRequests", userRequests);
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
            .populate('offeredBook')
            .populate('requestedTo');

        if (!exchangeRequest) {
            return res.status(404).json({ error: 'Exchange request not found' });
        }

        const { requester, requestedBook, offeredBook, requestedTo } = exchangeRequest;

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
                { $pull: { books: { $in: [requestedBook._id, offeredBook._id] } } },
                { session }
            );

            await User.updateMany(
                { _id: { $in: [requester._id, userId] } },
                { $push: { books: { $each: [requestedBook._id, offeredBook._id] } } },
                { session }
            );
            
            await Book.updateOne(
                { _id: requestedBook._id },
                { $set: { owner: userId } },
                { session }
            );

            await Book.updateOne(
                { _id: offeredBook._id },
                { $set: { owner: requester._id } },
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
            await session.abortTransaction();
            session.endSession();
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
            status: 'pending',
            requestedTo: requestedBook.owner
        };

        const existingRequest = await ExchangeRequest.findOne(requestData);
        if (existingRequest) return res.status(404).json({
            error: 'A similar pending exchange request already exists'
        });

        const exchangeRequest = new ExchangeRequest(requestData);
        await exchangeRequest.save();

        res.status(201).json({ message: 'Exchange request created', exchangeRequest });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

export default { getExchanges, getSentExchanges, acceptExchange, declineExchange, postExchange };