import express from 'express';
import {
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/review.controller.js';
import { requireSignIn } from '../middleware/auth.middleware.js';

const router = express.Router();

// Routes for create review POST /books/:id/reviews (protected routes)
router.post('/books/:id/reviews', requireSignIn, createReview);

// Routes for update PUT /reviews/:id and DELETE /reviews/:id (protected routes)
router
  .route('/reviews/:id')
  .put(requireSignIn, updateReview)
  .delete(requireSignIn, deleteReview);

export default router;
