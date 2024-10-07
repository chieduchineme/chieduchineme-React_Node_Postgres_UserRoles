// __tests__/authService.test.ts
import { handleOAuthLogin } from '../../services/authService';
import { User } from '../../models/userModel';
import Role from '../../models/roleModel';

jest.mock('../models/userModel');
jest.mock('../models/roleModel');

describe('Auth Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create a new user with default role', async () => {
    const mockRole = { id: 1, name: 'regular' };
    (Role.findOne as jest.Mock).mockResolvedValue(mockRole);
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.create as jest.Mock).mockResolvedValue(mockUser);

    const result = await handleOAuthLogin('john@example.com', 'John Doe');
    expect(result).toEqual(mockUser);
    expect(User.create).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'regular',
    });
  });

  test('should return existing user', async () => {
    const mockUser = { id: 1, name: 'Jane Doe', email: 'jane@example.com' };
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const result = await handleOAuthLogin('jane@example.com', 'Jane Doe');
    expect(result).toEqual(mockUser);
    expect(User.create).not.toHaveBeenCalled();
  });

  test('should throw error if default role not found', async () => {
    (Role.findOne as jest.Mock).mockResolvedValue(null);
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await expect(handleOAuthLogin('john@example.com', 'John Doe')).rejects.toThrow('Default role not found');
  });
});