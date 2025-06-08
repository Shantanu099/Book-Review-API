import jwt from 'jsonwebtoken';

export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const decode = jwt.verify(authHeader, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: 'Unauthorized Access',
    });
  }
};
