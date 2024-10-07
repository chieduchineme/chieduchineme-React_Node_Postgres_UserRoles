// reactFrontend/src/features/RolesManagement/RoleList.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent} from '@testing-library/react';
import RoleList from '../../features/RolesManagement/RoleList';

const mockRoles = [
  { id: '1', name: 'Admin', permissions: ['1'] },
  { id: '2', name: 'User', permissions: ['2'] },
];

describe('RoleList', () => {
  test('renders correctly with roles', () => {
    const handleSelectRole = jest.fn();
    render(<RoleList roles={mockRoles} selectedRoles={[]} onSelectRole={handleSelectRole} />);

    expect(screen.getByText(/admin/i)).toBeInTheDocument();
    expect(screen.getByText(/user/i)).toBeInTheDocument();
  });

  test('calls onSelectRole when a role is selected', () => {
    const handleSelectRole = jest.fn();
    render(<RoleList roles={mockRoles} selectedRoles={[]} onSelectRole={handleSelectRole} />);

    const adminCheckbox = screen.getByRole('checkbox', { name: /admin/i });
    fireEvent.click(adminCheckbox);
    
    expect(handleSelectRole).toHaveBeenCalledWith('1');
  });
});
