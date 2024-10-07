import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import UserRow from '../../features/UsersManagement/UserRow';

describe('UserRow', () => {
  const user = { id: '1', name: 'Test User', email: 'test@example.com', role: 'user' };
  const onSelectUser = jest.fn();

  test('renders correctly', () => {
    render(
      <UserRow
        user={user}
        isSelected={false}
        onSelectUser={onSelectUser}
        isCurrentUser={false}
      />
    );

    expect(screen.getByText(/test user/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/user/i)).toBeInTheDocument();
  });

  test('calls onSelectUser when checkbox is clicked', () => {
    render(
      <UserRow
        user={user}
        isSelected={false}
        onSelectUser={onSelectUser}
        isCurrentUser={false}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(onSelectUser).toHaveBeenCalledWith(user.id);
  });

  test('checkbox is disabled if user is the current user', () => {
    render(
      <UserRow
        user={user}
        isSelected={false}
        onSelectUser={onSelectUser}
        isCurrentUser={true}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });
});
