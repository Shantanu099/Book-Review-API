import Book from '../models/book.model.js';
import Review from '../models/review.model.js';
//  Create a new book
// @route   POST /books
export const createBook = async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error('Error creating book:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create book. Please try again later.',
      error: error.message,
    });
  }
};

//  Get all books with pagination and filters
// @route   GET /books
export const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.author) {
      filter.author = { $regex: `^${req.query.author}$`, $options: 'i' };
    }

    if (req.query.genre) {
      filter.genre = { $regex: `^${req.query.genre}$`, $options: 'i' };
    }

    const books = await Book.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    console.error('Error fetching books:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch books. Please try again later.',
      error: error.message,
    });
  }
};

// Get single book by ID along with the avg rating and the reviews with pagination
// @route   GET /books/:id
export const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'The requested book could not be found.',
      });
    }
    // Pagination of reviews
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const bookId = book.id;
    const reviews = await Review.find({ bookId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Book retrieved successfully',
      data: { book, reviews },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while retrieving the book',
    });
  }
};

// Search books by title or author
// @route   GET /api/search
export const searchBooks = async (req, res) => {
  try {
    const searchQuery = req.query.q;
    if (!searchQuery) {
      throw new AppError('Please provide a search query', 400);
    }

    const books = await Book.find({
      $or: [
        { title: new RegExp(searchQuery, 'i') },
        { author: new RegExp(searchQuery, 'i') },
      ],
    }).limit(10);

    res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while searching for the books',
    });
  }
};
