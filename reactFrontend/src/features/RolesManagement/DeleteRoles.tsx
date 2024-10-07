import React from 'react';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { removeRoles } from '../../store/rolesSlices';
import { deleteRoles } from '../../api/backendConn/roles';
import { RootState } from '../../store';
import { hasPermission } from '../../lib/permissions';
import { DeleteRolesButtonProps } from '@/types/roleTypes';

const DeleteRolesButton: React.FC<DeleteRolesButtonProps> = ({ selectedRoles, resetSelection }) => {
  const dispatch = useDispatch();
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const roles = useSelector((state: RootState) => state.roles.roles);

  const handleDeleteRoles = async () => {
    if (!hasPermission(userRole, roles, 'deleteRole')) {
      alert('You do not have permission to delete roles.');
      return;
    }

    await deleteRoles(selectedRoles);
    dispatch(removeRoles(selectedRoles));
    resetSelection();
  };

  return (
    <Button 
      variant="contained" 
      color="error" 
      onClick={handleDeleteRoles} 
      disabled={!hasPermission(userRole, roles, 'deleteRole')}
      style={{ marginTop: '10px' }}
    >
      Delete Selected Roles
    </Button>
  );
};

export default DeleteRolesButton;