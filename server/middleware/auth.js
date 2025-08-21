// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = function() {
  return async (req, res, next) => {
    try {
      // Get token from header
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Token is not valid' });
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (err) {
      console.error('Auth middleware error:', err);
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
};