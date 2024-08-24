import express from 'express'
import { getBook, postBook } from '../controllers/book.controller.js';
import validateBookDetails from '../middlewares/bookValidation.middleware.js';

const router = express.Router();

router.get('/', getBook);
router.post('/', validateBookDetails, postBook);

export default router;