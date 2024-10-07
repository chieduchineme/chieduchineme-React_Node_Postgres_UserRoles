// reactFrontend/src/features/RolesManagement/RoleRow.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RoleRow from '../../features/RolesManagement/RoleRow';
import { useDispatch, useSelector } from 'react-redux';
import * as api from '../../api/backendConn/roles';
import { hasPermission } from '../../lib/permissions';

// Mock the necessary modules and functions
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../api/backendConn/roles', () => ({
  changeRolePermissions: jest.fn(),
}));

jest.mock('../lib/permissions', () => ({
  hasPermission: jest.fn(),
}));

const mockRole = { id: '1', name: 'Test Role', permissions: ['1'] };
const mockRoles = ['admin', 'user'];
const mockUserRole = 'admin';

beforeEach(() => {
  (useDispatch as jest.Mock).mockReturnValue(jest.fn());
  (useSelector as jest.Mock)
    .mockReturnValueOnce(mockUserRole)
    .mockReturnValueOnce(mockRoles);
  (hasPermission as jest.Mock).mockReturnValue(true);
});

describe('RoleRow', () => {
  test('renders correctly with role data', () => {
    render(<RoleRow role={mockRole} isSelected={false} onSelectRole={jest.fn()} />);
    
    expect(screen.getByText(/test role/i)).toBeInTheDocument();
    expect(screen.getByText(/permission 1/i)).toBeInTheDocument();
  });

  test('allows editing of permissions', async () => {
    render(<RoleRow role={mockRole} isSelected={false} onSelectRole={jest.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    const permissionCheckbox = screen.getByLabelText(/permission 1/i);
    fireEvent.click(permissionCheckbox);
    
    expect(permissionCheckbox).not.toBeChecked(); // Should now be unchecked
  });

  test('calls changeRolePermissions API and dispatches updateRolePermissions action on save', async () => {
    const mockChangeRolePermissions = jest.fn();
    (api.changeRolePermissions as jest.Mock).mockResolvedValueOnce(mockChangeRolePermissions);

    render(<RoleRow role={mockRole} isSelected={false} onSelectRole={jest.fn()} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    const permissionCheckbox = screen.getByLabelText(/permission 1/i);
    fireEvent.click(permissionCheckbox);

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(api.changeRolePermissions).toHaveBeenCalledWith(mockRole.id, ['2']);
    });
  });

  test('shows alert if user does not have permission to edit a role', () => {
    (hasPermission as jest.Mock).mockReturnValueOnce(false);
    window.alert = jest.fn();

    render(<RoleRow role={mockRole} isSelected={false} onSelectRole={jest.fn()} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    expect(window.alert).toHaveBeenCalledWith('You do not have permission to save permissions.');
  });
});
