import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TableRow, TableCell, Button, Checkbox, FormControlLabel } from '@mui/material';
import { changeRolePermissions } from '../../api/backendConn/roles';
import { updateRolePermissions } from '../../store/rolesSlices';
import { RootState } from '../../store';
import { hasPermission } from '../../lib/permissions';
import permissionsData from '../../permission.json';
import { RoleRowProps } from '@/types/roleTypes';

const RoleRow: React.FC<RoleRowProps> = ({ role, isSelected, onSelectRole }) => {
  const dispatch = useDispatch();
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const roles = useSelector((state: RootState) => state.roles.roles);

  const [editRoleId, setEditRoleId] = useState<string | null>(null);
  const [editedPermissions, setEditedPermissions] = useState<string[]>(role.permissions);

  const handleToggleEdit = () => {
    setEditRoleId(editRoleId ? null : role.id);
  };

  const handleChangePermissions = (permission: string) => {
    const updatedPermissions = editedPermissions.includes(permission)
      ? editedPermissions.filter(perm => perm !== permission)
      : [...editedPermissions, permission];
    setEditedPermissions(updatedPermissions);
  };

  const handleSavePermissions = async () => {
    if (!hasPermission(userRole, roles, 'editRole')) {
      alert('You do not have permission to save permissions.');
      return;
    }

    await changeRolePermissions(role.id, editedPermissions);
    dispatch(updateRolePermissions({ roleId: role.id, newPermissions: editedPermissions }));
    setEditRoleId(null);
  };

  return (
    <TableRow key={role.id}>
      <TableCell>
        <Checkbox 
          checked={isSelected} 
          onChange={() => onSelectRole(role.id)} 
          disabled={role.name === 'admin'} // Disable for admin role
        />
      </TableCell>
      <TableCell>{role.name}</TableCell>
      <TableCell>
        {editRoleId === role.id ? (
          permissionsData.permissions.map((permission:any) => (
            <FormControlLabel
              key={permission.id}
              control={
                <Checkbox
                  checked={editedPermissions.includes(permission.id)}
                  onChange={() => handleChangePermissions(permission.id)}
                />
              }
              label={permission.permissionText}
            />
          ))
        ) : (
          role.permissions.join(', ')
        )}
      </TableCell>
      <TableCell>
        {editRoleId === role.id ? (
          <>
            <Button variant="outlined" onClick={handleSavePermissions}>Save</Button>
            <Button variant="outlined" onClick={() => setEditRoleId(null)}>Cancel</Button>
          </>
        ) : (
          <Button 
            variant="outlined" 
            onClick={handleToggleEdit} 
            disabled={!hasPermission(userRole, roles, 'editRole') || role.name === 'admin'}
          >
            Edit
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default RoleRow;