import { Router } from 'express';
import { createUser, removeUsers, changeUserRole, getUsers, getUserByEmail } from '../controllers/userController';
import { isAuthenticated } from '../middleware/authenticateMiddleware';
import { authorizeMiddleware } from '../middleware/authorizeMiddleware';

const router = Router();

// User management routes (admin-only)
router.post('/', isAuthenticated, authorizeMiddleware(['createUser']), createUser); // Admin-only route to create users
router.delete('/', isAuthenticated, authorizeMiddleware(['deleteUsers']), removeUsers); // Admin-only route to delete users
router.patch('/:userId/role', isAuthenticated, authorizeMiddleware(['changeUserRole']), changeUserRole); // Admin-only route to change user roles
router.get('/', isAuthenticated, authorizeMiddleware(['viewUsers']), getUsers); // Route to get all users
router.get('/:email', isAuthenticated, authorizeMiddleware(['viewUserByEmail']), getUserByEmail); // Route to get a user by email


export default router;
