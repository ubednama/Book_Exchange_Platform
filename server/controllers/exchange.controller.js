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
            .populate('offeredBook', 'title author');

        const filteredRequests = exchangeRequests.filter(req => req.requestedBook !== null);

        res.send(filteredRequests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch incoming exchange requests', details: error.message });
    }
}

const getSentExchanges = async (req, res) => {
    const userId = req.userId;

    try {
        const userRequests = await ExchangeRequest.find({ requester: userId })
            .populate('requestedBook', 'title author')
            .populate('offeredBook', 'title author')
            .populate('requester', 'name');

        res.send(userRequests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch outgoing exchange requests', details: error.message });
    }
}

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

        requestedBook.owner = requester._id;
        offeredBook.owner = userId;
        
        await requestedBook.save();
        await offeredBook.save();
        
        const requesterUser = await User.findById(requester._id);
        const currentUser = await User.findById(userId);

        requesterUser.books = requesterUser.books.filter(book => book.toString() !== offeredBook._id.toString());
        requesterUser.books.push(requestedBook._id);

        currentUser.books = currentUser.books.filter(book => book.toString() !== requestedBook._id.toString());
        currentUser.books.push(offeredBook._id);

        await requesterUser.save();
        await currentUser.save();

        exchangeRequest.status = 'accepted';
        await exchangeRequest.save();

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
            { status: 'canceled' }
        );

        res.status(200).json({ message: 'Exchange accepted and books ownership updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to accept exchange request', details: error.message });
    }
};

const postExchange = async (req, res) => {
    const { requestedBook, offeredBook } = req.body;
    const requester = req.userId;

    try {
        const requestedBookData = await Book.findById(requestedBook);
        const offeredBookData = await Book.findById(offeredBook);

        if (!requestedBookData || !offeredBookData) {
            return res.status(404).json({ error: 'One of the books was not found' });
        }

        if (requestedBookData.owner.toString() === requester) {
            return res.status(400).json({ error: 'You cannot exchange books that you own' });
        }

        const existingRequest = await ExchangeRequest.findOne({
            requester,
            requestedBook,
            offeredBook,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ error: 'A similar pending exchange request already exists' });
        }

        const exchangeRequest = new ExchangeRequest({ requester, requestedBook, offeredBook });
        await exchangeRequest.save();
        res.status(201).send(exchangeRequest);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create exchange request', details: error.message });
    }
};

export {
    getExchanges,
    getSentExchanges,
    acceptExchange,
    postExchange
}