// reactFrontend\src\features\RolesManagement\CreateRole.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Select, MenuItem, Checkbox, FormControl, InputLabel } from '@mui/material';
import { addRole } from '../../store/rolesSlices';
import { createRole } from '../../api/backendConn/roles';
import { RootState } from '../../store';
import { hasPermission } from '../../lib/permissions';
import permissionsData from '../../permission.json';

const CreateRoleForm: React.FC = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const roles = useSelector((state: RootState) => state.roles.roles);

  const [newRoleName, setNewRoleName] = useState('');
  const [newPermissions, setNewPermissions] = useState<string[]>([]);

  const handleCreateRole = async () => {
    if (!hasPermission(userRole, roles, 'createRole')) {
      alert('You do not have permission to create a role.');
      return;
    }

    const roleData = { name: newRoleName, permissions: newPermissions };
    const createdRole = await createRole(roleData);
    dispatch(addRole(createdRole.data));
    setNewRoleName('');
    setNewPermissions([]);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <TextField
        label="New Role Name"
        value={newRoleName}
        onChange={(e) => setNewRoleName(e.target.value)}
        style={{ marginRight: '10px' }}
      />
      <FormControl style={{ marginRight: '10px', width: '200px' }}>
        <InputLabel>Permissions</InputLabel>
        <Select
          multiple
          value={newPermissions}
          onChange={(e) => setNewPermissions(e.target.value as string[])}
          renderValue={(selected) => selected.join(', ')}
        >
          {permissionsData.permissions.map((permission: any) => (
            <MenuItem key={permission.id} value={permission.id}>
              <Checkbox checked={newPermissions.indexOf(permission.id) > -1} />
              {permission.permissionText}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleCreateRole} disabled={!hasPermission(userRole, roles, 'createRole')}>
        Create Role
      </Button>
    </div>
  );
};

export default CreateRoleForm;