import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { loadRoles } from '../store/rolesSlices';
import { fetchRoles } from '../api/backendConn/roles';
import RoleList from './RolesManagement/RoleList';
import CreateRoleForm from './RolesManagement/CreateRole';
import DeleteRolesButton from './RolesManagement/DeleteRoles';
import { RootState } from '../store';

const ManageRoles: React.FC = () => {
  const dispatch = useDispatch();
  const roles = useSelector((state: RootState) => state.roles.roles);

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  useEffect(() => {
    const loadRolesFromAPI = async () => {
      const rolesData = await fetchRoles();
      dispatch(loadRoles(rolesData.data));
    };
    loadRolesFromAPI();
  }, [dispatch]);

  const handleSelectRole = (roleId: string) => {
    setSelectedRoles(selectedRoles.includes(roleId)
      ? selectedRoles.filter(id => id !== roleId)
      : [...selectedRoles, roleId]);
  };

  return (
    <div>
      <Typography variant="h4">Manage Roles</Typography>

      <CreateRoleForm />

      <RoleList 
        roles={roles} 
        selectedRoles={selectedRoles} 
        onSelectRole={handleSelectRole} 
      />

      {selectedRoles.length > 0 && (
        <DeleteRolesButton 
          selectedRoles={selectedRoles} 
          resetSelection={() => setSelectedRoles([])} 
        />
      )}
    </div>
  );
};

export default ManageRoles;