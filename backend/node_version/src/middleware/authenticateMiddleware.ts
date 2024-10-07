// backend\src\middleware\authenticateMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session.user) {
    res.status(401).json({ message: 'Unauthorized: Please log in first.' });
    return;
  }
  next(); // Call the next middleware if authenticated
};
