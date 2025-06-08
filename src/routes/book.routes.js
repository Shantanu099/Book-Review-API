import express from 'express';
import {
  getBooks,
  getBook,
  searchBooks,
} from '../controllers/book.controller.js';

const router = express.Router();

router.get('/', getBooks);
router.get('/search', searchBooks);
router.get('/:id', getBook);

export default router;
