// routes/roleRoutes.ts
import { Router } from 'express';
import {
  createRoleHandler,
  deleteRolesHandler,
  changeRoleNameHandler,
  changeRolePermissionsHandler,
  getAllRolesHandler,
} from '../controllers/roleController';
import { isAuthenticated } from '../middleware/authenticateMiddleware';
import { authorizeMiddleware } from '../middleware/authorizeMiddleware';

const router = Router();

// Role management routes (admin-only)
router.post('/', isAuthenticated, authorizeMiddleware(['createRole']), createRoleHandler); // Create a new role
router.delete('/:roleId', isAuthenticated, authorizeMiddleware(['deleteRole']), deleteRolesHandler); // Delete a role
router.patch('/:roleId/name', isAuthenticated, authorizeMiddleware(['changeRoleName']), changeRoleNameHandler); // Change a role's name
router.patch('/:roleId/permissions', isAuthenticated, authorizeMiddleware(['changeRolePermissions']), changeRolePermissionsHandler); // Update a role's permissions
router.get('/', isAuthenticated, authorizeMiddleware(['viewRoles']), getAllRolesHandler); // Get all roles


export default router;
