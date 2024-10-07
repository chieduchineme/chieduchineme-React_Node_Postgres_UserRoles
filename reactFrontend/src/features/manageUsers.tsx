import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUsers } from '../store/usersSlices';
import { fetchUsers } from '../api/backendConn/users';
import { RootState } from '../store';
import CreateUserForm from './UsersManagement/CreateUser';
import UserList from './UsersManagement/UserList';
import DeleteUsersButton from './UsersManagement/DeleteUsers';

const ManageUsers: React.FC = () => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.users);
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    const loadUsersFromAPI = async () => {
      const response = await fetchUsers();
      dispatch(loadUsers(response.data));
    };
    loadUsersFromAPI();
  }, [dispatch]);

  const handleSelectUser = (userId: string) => {
    if (userId === currentUserId) {
      alert("You cannot select yourself for deletion.");
      return;
    }

    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter(id => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <CreateUserForm />
      <UserList
        users={users}
        selectedUsers={selectedUsers}
        onSelectUser={handleSelectUser}
        currentUserId={currentUserId || ''}
      />
      <DeleteUsersButton
        selectedUsers={selectedUsers}
        currentUserId={currentUserId || ''}
        resetSelection={() => setSelectedUsers([])}
      />
    </div>
  );
};

export default ManageUsers;