import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Update average rating when a review is added or updated
bookSchema.methods.updateAverageRating = async function () {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ bookId: this._id });

  if (reviews.length === 0) {
    this.averageRating = 0;
    this.reviewCount = 0;
  } else {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / reviews.length;
    this.reviewCount = reviews.length;
  }

  await this.save();
};

const Book = mongoose.model('Book', bookSchema);

export default Book;
