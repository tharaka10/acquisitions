import logger from '#config/logger.js';
import {
  getAllUsers,
  getUserById as getUserByIdService,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
} from '#services/users.service.js';
import {
  userIdSchema,
  updateUserSchema,
} from '#validations/users.validation.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Getting users ...');
    const allUsers = await getAllUsers();
    res.json({
      message: 'Successfully retrieved users',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    // Validate request parameters
    const { id } = userIdSchema.parse(req.params);

    logger.info(`Getting user with id ${id}`);
    const user = await getUserByIdService(id);

    res.json({
      message: 'Successfully retrieved user',
      user,
    });
  } catch (e) {
    logger.error('Error getting user by id', e);

    if (e.message === 'User not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }

    if (e.errors) {
      // Zod validation error
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid request data',
        details: e.errors,
      });
    }

    next(e);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    // Validate request parameters and body
    const { id } = userIdSchema.parse(req.params);
    const updates = updateUserSchema.parse(req.body);

    // Authorization checks
    const currentUser = req.user;
    const targetUserId = id;

    // Users can only update their own information
    if (currentUser.id !== targetUserId && currentUser.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own information',
      });
    }

    // Only admins can change roles
    if (updates.role && currentUser.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only admins can change user roles',
      });
    }

    logger.info(`Updating user with id ${id}`);
    const updatedUser = await updateUserService(id, updates);

    res.json({
      message: 'Successfully updated user',
      user: updatedUser,
    });
  } catch (e) {
    logger.error('Error updating user', e);

    if (e.message === 'User not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }

    if (e.errors) {
      // Zod validation error
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid request data',
        details: e.errors,
      });
    }

    next(e);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    // Validate request parameters
    const { id } = userIdSchema.parse(req.params);

    // Authorization checks
    const currentUser = req.user;
    const targetUserId = id;

    // Users can only delete their own account, or admins can delete any account
    if (currentUser.id !== targetUserId && currentUser.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own account',
      });
    }

    // Prevent users from deleting themselves if they are the only admin
    // (This is a basic safety check - in production you might want more sophisticated logic)
    if (currentUser.id === targetUserId && currentUser.role === 'admin') {
      logger.warn(
        `Admin user ${currentUser.id} attempting to delete their own account`
      );
    }

    logger.info(`Deleting user with id ${id}`);
    const deletedUser = await deleteUserService(id);

    res.json({
      message: 'Successfully deleted user',
      user: deletedUser,
    });
  } catch (e) {
    logger.error('Error deleting user', e);

    if (e.message === 'User not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }

    if (e.errors) {
      // Zod validation error
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid request data',
        details: e.errors,
      });
    }

    next(e);
  }
};
