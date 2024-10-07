// backend\src\middleware\authorizeMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import Role from '../models/roleModel';

// Middleware to authorize based on permissions
export const authorizeMiddleware = (requiredPermissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Retrieve the role from the session
    const userRole = req.session.user?.role; // Ensure that user role is stored in session
    try {
      // Check if user role exists in the session
      if (!userRole) {
        res.status(403).json({ message: 'Role not found in session' });
        return; // Explicitly return after sending response
      }

      // Find the role based on the userRole from the session
      const role = await Role.findOne({ where: { name: userRole } });

      if (!role) {
        res.status(403).json({ message: 'Role not found' });
        return; // Explicitly return after sending response
      }

      const rolePermissions = role.permissions;
      // Admins can do anything, so short-circuit for the "admin" role
      if (userRole == 'admin' || rolePermissions.includes('all')) {
        return next(); // Allow access
      }

      // Check if the role has the required permission(s)
      const hasPermission = requiredPermissions.some(permission => rolePermissions.includes(permission));
      if (!hasPermission) {
        res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
        return; // Explicitly return after sending response
      }

      // Proceed if the user has the required permissions
      next();
    } catch (error: any) {
      res.status(500).json({ message: 'Authorization failed', error: error.message });
    }
  };
};
