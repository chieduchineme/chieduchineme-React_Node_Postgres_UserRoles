import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateUser from '../../features/UsersManagement/CreateUser';
import { useDispatch, useSelector } from 'react-redux';
import * as api from '../../api/backendConn/users';
import { hasPermission } from '../../lib/permissions';

// Mock necessary modules and functions
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../api/backendConn/users', () => ({
  adminCreateUser: jest.fn(),
}));

jest.mock('../lib/permissions', () => ({
  hasPermission: jest.fn(),
}));

const mockRoles = ['admin', 'user'];
const mockUserRole = 'admin';

beforeEach(() => {
  (useDispatch as jest.Mock).mockReturnValue(jest.fn());
  (useSelector as jest.Mock)
    .mockReturnValueOnce(mockUserRole) // For user role
    .mockReturnValueOnce(mockRoles); // For roles
  (hasPermission as jest.Mock).mockReturnValue(true); // Grant permission
});

describe('CreateUserForm', () => {
  test('renders correctly', () => {
    render(<CreateUser />);
    
    expect(screen.getByLabelText(/user name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/user email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create user/i })).toBeInTheDocument();
  });

  test('allows user to input user details', () => {
    render(<CreateUser />);
    
    const userNameInput = screen.getByLabelText(/user name/i);
    fireEvent.change(userNameInput, { target: { value: 'Test User' } });
    expect(userNameInput).toBe('Test User');

    const userEmailInput = screen.getByLabelText(/user email/i);
    fireEvent.change(userEmailInput, { target: { value: 'test@example.com' } });
    expect(userEmailInput).toBe('test@example.com');
  });

  test('calls adminCreateUser API on successful submission', async () => {
    const mockCreatedUser = { data: { id: '1', name: 'Test User', email: 'test@example.com', role: 'user' } };
    (api.adminCreateUser as jest.Mock).mockResolvedValueOnce(mockCreatedUser);

    render(<CreateUser />);
    
    fireEvent.change(screen.getByLabelText(/user name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/user email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: 'user' } });

    const createUserButton = screen.getByRole('button', { name: /create user/i });
    fireEvent.click(createUserButton);

    await waitFor(() => {
      expect(api.adminCreateUser).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      });
    });
  });

  test('shows alert if user does not have permission to create a user', () => {
    (hasPermission as jest.Mock).mockReturnValueOnce(false);
    window.alert = jest.fn(); // Mock alert

    render(<CreateUser />);
    const createUserButton = screen.getByRole('button', { name: /create user/i });
    fireEvent.click(createUserButton);

    expect(window.alert).toHaveBeenCalledWith('You do not have permission to create a user.');
  });
});
