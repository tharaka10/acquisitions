import express from 'express';
import {
  fetchAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '#controllers/users.controller.js';
import { authenticateToken, requireAuth } from '#middleware/auth.middleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /users - Get all users (requires authentication)
router.get('/', requireAuth, fetchAllUsers);

// GET /users/:id - Get user by ID (requires authentication)
router.get('/:id', requireAuth, getUserById);

// PUT /users/:id - Update user (requires authentication + ownership or admin)
router.put('/:id', requireAuth, updateUser);

// DELETE /users/:id - Delete user (requires authentication + ownership or admin)
router.delete('/:id', requireAuth, deleteUser);

export default router;
