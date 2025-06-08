import User from '../models/user.model.js';
import { AppError } from '../utils/error.utils.js';
import jwt from 'jsonwebtoken';

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new AppError('User already exists', 400);
    }

    // Create user
    const newUser = await User.create({
      email,
      password,
    });

    res.status(201).json({
      success: true,
      data: {
        id: newUser._id,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while signup',
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    if (user.password !== password) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    console.log('Generated token:', token);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { signup, login };
