import express from 'express'
import { deleteBook, editBook, getBook, getMatches, getUserBooks, postBook } from '../../controllers/book.controller.js';
import {validateBookDetails, validateBookEdit} from '../../middlewares/bookValidation.middleware.js';

const router = express.Router();

router.get('/', getBook);
router.get('/user', getUserBooks);
router.post('/', validateBookDetails, postBook);
router.put('/:id', validateBookEdit, editBook);
router.delete('/:id', deleteBook);
router.get('/matches', getMatches);

export default router;