import express from 'express'
import exchangeController from '../../controllers/exchange.controller.js';
import validateExchangeRequest from '../../middlewares/exchangeValidation.middleware.js';
const { getExchanges, getSentExchanges, acceptExchange, declineExchange, postExchange } = exchangeController;

const router = express.Router();

router.get('/', getExchanges);
router.get('/sent', getSentExchanges);
router.post('/', validateExchangeRequest, postExchange);
router.post('/:exchangeId/accept', acceptExchange)
router.post('/:exchangeId/decline', declineExchange)

export default router;