import express from 'express'
import { getExchange, postExchange } from '../controllers/exchange.controller.js';
import validateExchangeRequest from '../middlewares/exchangeValidation.middleware.js';

const router = express.Router();

router.get('/', getExchange);
router.post('/', validateExchangeRequest, postExchange);

export default router;