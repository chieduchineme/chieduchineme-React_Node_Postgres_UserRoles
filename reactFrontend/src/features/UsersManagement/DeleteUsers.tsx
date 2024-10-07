import React from 'react';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { removeUsers } from '../../store/usersSlices';
import { adminDeleteUsers } from '../../api/backendConn/users';
import { RootState } from '../../store';
import { hasPermission } from '../../lib/permissions';
import { DeleteUsersButtonProps } from '@/types/userTypes';

const DeleteUsersButton: React.FC<DeleteUsersButtonProps> = ({ selectedUsers, currentUserId, resetSelection }) => {
  const dispatch = useDispatch();
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const roles = useSelector((state: RootState) => state.roles.roles);

  const handleDeleteUsers = async () => {
    if (!hasPermission(userRole, roles, 'deleteUser')) {
      alert('You do not have permission to delete users.');
      return;
    }

    if (selectedUsers.includes(currentUserId)) {
      alert("You cannot delete yourself.");
      return;
    }

    try {
      await adminDeleteUsers(selectedUsers);
      dispatch(removeUsers(selectedUsers));
      resetSelection();
    } catch (error) {
      console.error('Failed to delete users:', error);
      alert('Failed to delete users. Please try again.');
    }
  };

  return (
    <Button
      variant="contained"
      color="error"
      onClick={handleDeleteUsers}
      disabled={selectedUsers.length === 0}
      style={{ marginTop: '10px' }}
    >
      Delete Selected Users
    </Button>
  );
};

export default DeleteUsersButton;