import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ManageUsers from '../../features/manageUsers';
import { useDispatch, useSelector } from 'react-redux';
import * as api from '../../api/backendConn/users';

// Mock necessary modules and functions
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../api/backendConn/users', () => ({
  fetchUsers: jest.fn(),
  adminCreateUser: jest.fn(),
  adminDeleteUsers: jest.fn(),
}));

const mockUsers = [
  { id: '1', name: 'User One', email: 'userone@example.com', role: 'user' },
  { id: '2', name: 'User Two', email: 'usertwo@example.com', role: 'admin' },
];
const mockUserRole = 'admin';

beforeEach(() => {
  (useDispatch as jest.Mock).mockReturnValue(jest.fn());
  (useSelector as jest.Mock)
    .mockReturnValueOnce(mockUserRole) // For user role
    .mockReturnValueOnce(mockUsers); // For users
});

describe('ManageUsers', () => {
  test('renders correctly and fetches users', async () => {
    (api.fetchUsers as jest.Mock).mockResolvedValueOnce({ data: mockUsers });

    render(<ManageUsers />);
    
    await waitFor(() => {
      expect(screen.getByText(/user one/i)).toBeInTheDocument();
      expect(screen.getByText(/user two/i)).toBeInTheDocument();
    });
  });

  test('creates a new user successfully', async () => {
    const mockCreatedUser = { data: { id: '3', name: 'User Three', email: 'userthree@example.com', role: 'user' } };
    (api.adminCreateUser as jest.Mock).mockResolvedValueOnce(mockCreatedUser);
    (api.fetchUsers as jest.Mock).mockResolvedValueOnce({ data: mockUsers });

    render(<ManageUsers />);

    fireEvent.change(screen.getByLabelText(/user name/i), { target: { value: 'User Three' } });
    fireEvent.change(screen.getByLabelText(/user email/i), { target: { value: 'userthree@example.com' } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: 'user' } });
    fireEvent.click(screen.getByRole('button', { name: /create user/i }));

    await waitFor(() => {
      expect(api.adminCreateUser).toHaveBeenCalledWith({
        name: 'User Three',
        email: 'userthree@example.com',
        role: 'user',
      });
    });

    expect(screen.getByText(/user three/i)).toBeInTheDocument();
  });

  test('deletes selected users successfully', async () => {
    const selectedUsers = ['1'];
    (api.adminDeleteUsers as jest.Mock).mockResolvedValueOnce({ data: {} });

    render(<ManageUsers />);
    fireEvent.click(screen.getByLabelText(/user one/i)); // Select user one

    fireEvent.click(screen.getByRole('button', { name: /delete selected users/i }));

    await waitFor(() => {
      expect(api.adminDeleteUsers).toHaveBeenCalledWith(selectedUsers);
    });

    expect(screen.queryByText(/user one/i)).not.toBeInTheDocument(); // Check if user one is removed
  });
});