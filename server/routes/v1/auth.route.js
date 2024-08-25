import express from 'express';
import { login, register } from '../../controllers/auth.controller.js';
import verifyAuth from '../../middlewares/auth.middleware.js';
import { removeToken } from '../../config/authUtils.js';

const router = express.Router();

router.post('/register', verifyAuth, register);
router.post('/login', verifyAuth, login);
router.post('/logout', removeToken);

export default router;