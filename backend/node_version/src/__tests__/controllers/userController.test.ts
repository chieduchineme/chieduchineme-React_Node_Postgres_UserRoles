// __tests__/userController.test.ts
import request from 'supertest';
import express from 'express';
import { createUser, removeUsers, getUserByEmail, changeUserRole, getUsers } from '../../controllers/userController';
import { addUser, deleteUsers, assignRoleToUser, findUserByEmail, getUsers as fetchUsers } from '../../services/userService';

const app = express();
app.use(express.json());
app.post('/users', createUser);
app.delete('/users', removeUsers);  
app.get('/users/email/:email', getUserByEmail);
app.patch('/users/:userId/role', changeUserRole);
app.get('/users', getUsers);

jest.mock('../../services/userService');

describe('User Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create a new user', async () => {
    const mockUser = { id: 1, email: 'john@example.com', name: 'John Doe', role: 'regular' };
    (addUser as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/users')
      .send({ email: 'john@example.com', name: 'John Doe', role: 'regular' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
    expect(addUser).toHaveBeenCalledWith('john@example.com', 'John Doe', 'regular');
  });

  // Updated test for deleting users using an array of IDs
  test('should delete users', async () => {
    (deleteUsers as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app)
      .delete('/users')
      .send({ userIds: [1, 2] });  // Send array of user IDs

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Users deleted successfully' });
    expect(deleteUsers).toHaveBeenCalledWith([1, 2]);  // Verify it was called with array
  });

  test('should find user by email', async () => {
    const mockUser = { id: 1, email: 'john@example.com', name: 'John Doe' };
    (findUserByEmail as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app)
      .get('/users/email/john@example.com');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
    expect(findUserByEmail).toHaveBeenCalledWith('john@example.com');
  });

  test('should change user role', async () => {
    (assignRoleToUser as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app)
      .patch('/users/1/role')
      .send({ role: 'admin' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Role updated successfully' });
    expect(assignRoleToUser).toHaveBeenCalledWith('1', 'admin');
  });

  test('should get all users', async () => {
    const mockUsers = [
      { id: 1, email: 'john@example.com', name: 'John Doe' },
      { id: 2, email: 'jane@example.com', name: 'Jane Doe' },
    ];
    (fetchUsers as jest.Mock).mockResolvedValue(mockUsers);

    const response = await request(app)
      .get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUsers);
    expect(fetchUsers).toHaveBeenCalled();
  });
});
