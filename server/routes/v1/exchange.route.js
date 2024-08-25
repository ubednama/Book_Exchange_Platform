import express from 'express'
import { acceptExchange, getExchanges, getSentExchanges, postExchange } from '../../controllers/exchange.controller.js';
import validateExchangeRequest from '../../middlewares/exchangeValidation.middleware.js';

const router = express.Router();

router.get('/', getExchanges);
router.get('/sent', getSentExchanges);
router.post('/', validateExchangeRequest, postExchange);
router.post('/:exchangeId/accept', acceptExchange)

export default router;