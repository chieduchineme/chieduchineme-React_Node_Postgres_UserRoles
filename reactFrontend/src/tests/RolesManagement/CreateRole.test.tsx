// reactFrontend\src\features\RolesManagement\CreateRole.test.tsx
import '@testing-library/jest-dom'; // Ensure this is imported
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateRoleForm from '../../features/RolesManagement/CreateRole';
import { useDispatch, useSelector } from 'react-redux';
import * as api from '../../api/backendConn/roles';
import { hasPermission } from '../../lib/permissions';

// Mock the necessary modules and functions
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../api/backendConn/roles', () => ({
  createRole: jest.fn(),
}));

jest.mock('../../lib/permissions', () => ({
  hasPermission: jest.fn(),
}));

// Sample permissions data for testing
const mockPermissions = [
  { id: '1', permissionText: 'Permission 1' },
  { id: '2', permissionText: 'Permission 2' },
];

// Mock data for useSelector
const mockRoles = ['admin', 'user'];
const mockUserRole = 'admin';

// Setup the test before each case
beforeEach(() => {
  (useDispatch as jest.Mock).mockReturnValue(jest.fn());
  (useSelector as jest.Mock)
    .mockReturnValueOnce(mockUserRole) // For user role
    .mockReturnValueOnce(mockRoles); // For roles
  (hasPermission as jest.Mock).mockReturnValue(true); // Grant permission
});

describe('CreateRoleForm', () => {
  test('renders correctly', () => {
    render(<CreateRoleForm />);
    
    expect(screen.getByLabelText(/new role name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/permissions/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create role/i })).toBeInTheDocument();
  });

  test('allows user to input role name and select permissions', () => {
    render(<CreateRoleForm />);

    const roleNameInput = screen.getByLabelText(/new role name/i);
    fireEvent.change(roleNameInput, { target: { value: 'Test Role' } });
    expect(roleNameInput.role).toBe('Test Role');

    const permissionSelect = screen.getByLabelText(/permissions/i);
    fireEvent.mouseDown(permissionSelect);
    
    mockPermissions.forEach(permission => {
      expect(screen.getByText(permission.permissionText)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(mockPermissions[0].permissionText));
    expect(permissionSelect).toHaveValue([mockPermissions[0].id]);
  });

  test('calls createRole API and dispatches addRole action on successful submission', async () => {
    const mockCreatedRole = { data: { id: '1', name: 'Test Role', permissions: ['1'] } };
    (api.createRole as jest.Mock).mockResolvedValueOnce(mockCreatedRole);

    render(<CreateRoleForm />);
    
    const roleNameInput = screen.getByLabelText(/new role name/i);
    fireEvent.change(roleNameInput, { target: { value: 'Test Role' } });

    const permissionSelect = screen.getByLabelText(/permissions/i);
    fireEvent.mouseDown(permissionSelect);
    fireEvent.click(screen.getByText(mockPermissions[0].permissionText));

    const createRoleButton = screen.getByRole('button', { name: /create role/i });
    fireEvent.click(createRoleButton);

    await waitFor(() => {
      expect(api.createRole).toHaveBeenCalledWith({
        name: 'Test Role',
        permissions: [mockPermissions[0].id],
      });
    });
  });

  test('shows alert if user does not have permission to create a role', () => {
    (hasPermission as jest.Mock).mockReturnValueOnce(false);
    window.alert = jest.fn(); // Mock alert

    render(<CreateRoleForm />);

    const createRoleButton = screen.getByRole('button', { name: /create role/i });
    fireEvent.click(createRoleButton);

    expect(window.alert).toHaveBeenCalledWith('You do not have permission to create a role.');
  });
});
