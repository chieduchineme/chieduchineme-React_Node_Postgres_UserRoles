import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteUsers from '../../features/UsersManagement/DeleteUsers';
import { useDispatch, useSelector } from 'react-redux';
import * as api from '../../api/backendConn/users';

// Mock necessary modules and functions
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../api/backendConn/users', () => ({
  adminDeleteUsers: jest.fn(),
}));

const mockUserRole = 'admin';
const mockRoles = ['admin', 'user'];

beforeEach(() => {
  (useDispatch as jest.Mock).mockReturnValue(jest.fn());
  (useSelector as jest.Mock)
    .mockReturnValueOnce(mockUserRole) // For user role
    .mockReturnValueOnce(mockRoles); // For roles
});

describe('DeleteUsersButton', () => {
  const selectedUsers = ['1', '2'];
  const currentUserId = '1'; // Current user cannot be deleted

  test('renders correctly and is disabled if no users are selected', () => {
    render(
      <DeleteUsers
        selectedUsers={[]}
        currentUserId={currentUserId}
        resetSelection={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /delete selected users/i })).toBeDisabled();
  });

  test('calls adminDeleteUsers on button click', async () => {
    const mockDeletedResponse = { data: {} };
    (api.adminDeleteUsers as jest.Mock).mockResolvedValueOnce(mockDeletedResponse);

    render(
      <DeleteUsers
        selectedUsers={selectedUsers}
        currentUserId={currentUserId}
        resetSelection={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete selected users/i }));

    await waitFor(() => {
      expect(api.adminDeleteUsers).toHaveBeenCalledWith(selectedUsers);
    });
  });

  test('shows alert if trying to delete the current user', () => {
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(
      <DeleteUsers
        selectedUsers={[currentUserId]}
        currentUserId={currentUserId}
        resetSelection={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete selected users/i }));

    expect(mockAlert).toHaveBeenCalledWith('You cannot delete yourself.');
    mockAlert.mockRestore();
  });
});