// __tests__/userService.test.ts
import {
  addUser,
  deleteUsers,
  assignRoleToUser,
  getUsers,
  findUserByEmail,
} from '../../services/userService'; 
import { User } from '../../models/userModel';

jest.mock('../../models/userModel'); // Mock the User model

describe('User Service Tests', () => {
  beforeEach(() => {
      jest.clearAllMocks(); // Clear previous mocks before each test
  });

  test('should add a new user', async () => {
      const mockUser = { id: 1, email: 'john@example.com', name: 'John Doe', role: 'regular' };
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await addUser('john@example.com', 'John Doe', 'regular');
      expect(result).toEqual(mockUser);
      expect(User.create).toHaveBeenCalledWith({ email: 'john@example.com', name: 'John Doe', role: 'regular' });
  });

  test('should delete users', async () => {
      const mockDeletedCount = 2; // Simulate deleting 2 users
      (User.destroy as jest.Mock).mockResolvedValue(mockDeletedCount); // Simulate successful deletion of 2 users

      const userIds = ['1', '2']; // Array of user IDs to delete
      await deleteUsers(userIds);
      expect(User.destroy).toHaveBeenCalledWith({ where: { id: userIds } });
  });

  test('should assign a role to an existing user', async () => {
      const mockUser = { id: 1, role: 'regular', save: jest.fn() };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      await assignRoleToUser('1', 'admin');
      expect(mockUser.role).toBe('admin');
      expect(mockUser.save).toHaveBeenCalled();
  });

  test('should throw error when assigning role to non-existent user', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null); // Simulate user not found

      await expect(assignRoleToUser('1', 'admin')).rejects.toThrow('User not found');
  });

  test('should get all users', async () => {
      const mockUsers = [
          { id: 1, email: 'john@example.com', name: 'John Doe' },
          { id: 2, email: 'jane@example.com', name: 'Jane Doe' },
      ];
      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

      const result = await getUsers();
      expect(result).toEqual(mockUsers);
  });

  test('should find user by email', async () => {
      const mockUser = { id: 1, email: 'john@example.com', name: 'John Doe' };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await findUserByEmail('john@example.com');
      expect(result).toEqual(mockUser);
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
  });

  test('should return null if user not found by email', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const result = await findUserByEmail('notfound@example.com');
      expect(result).toBeNull();
  });
});
