// reactFrontend/src/features/RolesManagement/ManageRoles.test.tsx
import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ManageRoles from '../../features/manageRoles';
import { useDispatch, useSelector } from 'react-redux';
import * as api from '../../api/backendConn/roles';

// Mock the necessary modules and functions
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../api/backendConn/roles', () => ({
  fetchRoles: jest.fn(),
}));

const mockRoles = [
  { id: '1', name: 'Admin', permissions: ['1'] },
  { id: '2', name: 'User', permissions: ['2'] },
];

beforeEach(() => {
  (useDispatch as jest.Mock).mockReturnValue(jest.fn());
  (useSelector as jest.Mock).mockReturnValue(mockRoles);
  (api.fetchRoles as jest.Mock).mockResolvedValueOnce({ data: mockRoles });
});

describe('ManageRoles', () => {
  test('renders correctly', async () => {
    render(<ManageRoles />);

    expect(screen.getByText(/manage roles/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/admin/i)).toBeInTheDocument();
      expect(screen.getByText(/user/i)).toBeInTheDocument();
    });
  });

  test('loads roles on mount', async () => {
    render(<ManageRoles />);

    await waitFor(() => {
      expect(api.fetchRoles).toHaveBeenCalled();
    });
  });

  test('handles role selection', () => {
    render(<ManageRoles />);

    const adminCheckbox = screen.getByRole('checkbox', { name: /admin/i });
    fireEvent.click(adminCheckbox);

    expect(adminCheckbox).toBeChecked();
  });
});
