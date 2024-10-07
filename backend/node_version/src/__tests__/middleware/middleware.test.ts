// __tests__/middleware.test.ts
import { Request, Response, NextFunction } from 'express';
import { isAuthenticated } from '../../middleware/authenticateMiddleware';
import { authorizeMiddleware } from '../../middleware/authorizeMiddleware';
import Role from '../../models/roleModel';

jest.mock('../models/roleModel'); // Mock the Role model

describe('Authentication Middleware', () => {
  test('should deny access if user is not authenticated', () => {
    const req = { session: {} } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    isAuthenticated(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: Please log in first.' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should allow access if user is authenticated', () => {
    const req = { session: { user: { email: 'test@example.com' } } } as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    isAuthenticated(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

describe('Authorization Middleware', () => {
  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should deny access if role is not found in session', async () => {
    const req = { session: { user: {} } } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const middleware = authorizeMiddleware(['read']);

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Role not found in session' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should deny access if role is not found in database', async () => {
    const req = { session: { user: { role: 'user' } } } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (Role.findOne as jest.Mock).mockResolvedValue(null); // Mock Role to return null

    const middleware = authorizeMiddleware(['read']);

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Role not found' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should allow access for admin role', async () => {
    const req = { session: { user: { role: 'admin' } } } as Request;
    const res = {} as Response;

    const middleware = authorizeMiddleware(['read']);

    await middleware(req, res, next);

    expect(next).toHaveBeenCalled(); // Admin should bypass permission checks
  });

  test('should deny access if permissions do not match', async () => {
    const req = { session: { user: { role: 'user' } } } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockRole = { permissions: ['write'] };
    (Role.findOne as jest.Mock).mockResolvedValue(mockRole); // Mock the Role

    const middleware = authorizeMiddleware(['read']); // Required permission is 'read'

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden: You do not have access to this resource' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should allow access if user has required permission', async () => {
    const req = { session: { user: { role: 'user' } } } as Request;
    const res = {} as Response;

    const mockRole = { permissions: ['read'] };
    (Role.findOne as jest.Mock).mockResolvedValue(mockRole); // Mock the Role

    const middleware = authorizeMiddleware(['read']); // Required permission is 'read'

    await middleware(req, res, next);

    expect(next).toHaveBeenCalled(); // Should proceed to next middleware
  });
});
