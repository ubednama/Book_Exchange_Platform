import express from 'express';
import authRoutes from './auth.route.js';
import bookRoutes from './books.route.js';
import exchangeRoutes from './exchange.route.js'
import { authenticateToken } from '../../config/authUtils.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/books', authenticateToken, bookRoutes);
router.use('/exchange-requests', authenticateToken, exchangeRoutes)

export default router;