import express from 'express';
import { signup, login } from '../controllers/auth.controller.js';
import { requireSignIn } from '../middleware/auth.middleware.js';
import { createBook } from '../controllers/book.controller.js';

const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.post('/books', requireSignIn, createBook);

export default router;
