// reactFrontend/src/features/RolesManagement/DeleteRolesButton.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteRoles from '../../features/RolesManagement/DeleteRoles';
import { useDispatch } from 'react-redux';
import * as api from '../../api/backendConn/roles';
import { hasPermission } from '../../lib/permissions';

// Mock the necessary modules and functions
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../api/backendConn/roles', () => ({
  deleteRoles: jest.fn(),
}));

jest.mock('../lib/permissions', () => ({
  hasPermission: jest.fn(),
}));

beforeEach(() => {
  (useDispatch as jest.Mock).mockReturnValue(jest.fn());
  (hasPermission as jest.Mock).mockReturnValue(true);
});

describe('DeleteRolesButton', () => {
  test('renders correctly', () => {
    render(<DeleteRoles selectedRoles={['1', '2']} resetSelection={jest.fn()} />);
    
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  test('calls deleteRoles API on button click', async () => {
    const mockDeleteResponse = { success: true };
    (api.deleteRoles as jest.Mock).mockResolvedValueOnce(mockDeleteResponse);
    
    render(<DeleteRoles selectedRoles={['1', '2']} resetSelection={jest.fn()} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(api.deleteRoles).toHaveBeenCalledWith(['1', '2']);
    });
  });

  test('shows alert if user does not have permission to delete roles', () => {
    (hasPermission as jest.Mock).mockReturnValueOnce(false);
    window.alert = jest.fn();

    render(<DeleteRoles selectedRoles={['1', '2']} resetSelection={jest.fn()} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(window.alert).toHaveBeenCalledWith('You do not have permission to delete roles.');
  });
});
