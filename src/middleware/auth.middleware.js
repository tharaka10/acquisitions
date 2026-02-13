import { jwttoken } from '#utils/jwt.js';
import logger from '#config/logger.js';

export const authenticateToken = (req, res, next) => {
  try {
    // Check for token in Authorization header first
    const authHeader = req.headers.authorization;
    let token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        
    // If no token in header, check cookies
    if (!token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Access token is required'
      });
    }

    const decoded = jwttoken.verify(token);
    req.user = decoded;
    next();
  } catch (e) {
    logger.error('Token verification failed', e);
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid or expired token'
    });
  }
};

export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required'
    });
  }
  next();
};

export const requireOwnershipOrAdmin = (req, res, next) => {
  const userId = parseInt(req.params.id);
    
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }
    
  if (req.user.role === 'admin' || req.user.id === userId) {
    return next();
  }
    
  return res.status(403).json({
    error: 'Forbidden',
    message: 'You can only access your own resources'
  });
};