import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import UserList from '../../features/UsersManagement/UserList'; // Ensure correct import path

describe('UserList', () => {
  const users = [
    { id: '1', name: 'User One', email: 'userone@example.com', role: 'user' },
    { id: '2', name: 'User Two', email: 'usertwo@example.com', role: 'admin' },
  ];
  const onSelectUser = jest.fn();
  const currentUserId = '2'; // Assume current user ID is 2

  test('renders correctly', () => {
    render(
      <UserList
        users={users}
        selectedUsers={[]}
        onSelectUser={onSelectUser}
        currentUserId={currentUserId}
      />
    );

    expect(screen.getByText(/user one/i)).toBeInTheDocument();
    expect(screen.getByText(/user two/i)).toBeInTheDocument();
  });

  test('calls onSelectUser when a user is selected', () => {
    render(
      <UserList
        users={users}
        selectedUsers={[]}
        onSelectUser={onSelectUser}
        currentUserId={currentUserId}
      />
    );

    fireEvent.click(screen.getByLabelText(/user one/i));
    expect(onSelectUser).toHaveBeenCalledWith(users[0].id);
  });

  test('disables checkbox for the current user', () => {
    render(
      <UserList
        users={users}
        selectedUsers={[]}
        onSelectUser={onSelectUser}
        currentUserId={currentUserId}
      />
    );

    const userTwoCheckbox = screen.getByLabelText(/user two/i);
    expect(userTwoCheckbox).toBeDisabled(); // User Two is the current user
  });
});
