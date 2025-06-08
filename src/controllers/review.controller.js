import Review from '../models/review.model.js';
import Book from '../models/book.model.js';

// function to update average rating of a book
async function updateAverageRating(bookId) {
  const reviews = await Review.find({ bookId });
  const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  const book = await Book.findById(bookId);
  if (book) {
    book.averageRating = avgRating;
    await book.save();
  }
}

// @desc    Create a review
// @route   POST /books/:id/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.id;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'The book you are trying to review does not exist.',
      });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({ bookId, userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this book.',
      });
    }

    const review = await Review.create({
      bookId,
      userId,
      rating: req.body.rating,
    });

    // Update average rating
    await updateAverageRating(bookId);

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Update a review
// @route   PUT /reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'The review does not exist',
      });
    }

    // Check if the review belongs to the user
    if (review.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review',
      });
    }

    review.rating = req.body.rating;
    await review.save();

    // Update average rating
    await updateAverageRating(review.bookId);

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Error while updating the review' });
  }
};

// @desc    Delete a review
// @route   DELETE /reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'The review does not exist',
      });
    }

    // Check if the review belongs to the user
    if (review.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    const bookId = review.bookId;
    await review.deleteOne();

    // Update average rating
    await updateAverageRating(bookId);

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Error while deleting the review' });
  }
};
