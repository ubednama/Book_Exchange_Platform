import ExchangeRequest from "../models/Exchange.js";

const getExchange = async (req, res) => {
    try {
        const exchangeRequests = await ExchangeRequest.find()
            .populate('requester', 'name')
            .populate('requestedBook', 'title author')
            .populate('offeredBook', 'title author');

        res.send(exchangeRequests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch exchange requests', details: error.message });
    }
}


const postExchange = async (req, res) => {
    try {
        const { requester, requestedBook, offeredBook } = req.body;
        const exchangeRequest = new ExchangeRequest({ requester, requestedBook, offeredBook });
        await exchangeRequest.save();
        res.status(201).send(exchangeRequest);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create exchange request', details: error.message });
    }
}


export {
    getExchange,
    postExchange
}