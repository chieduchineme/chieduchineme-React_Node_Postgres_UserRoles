import React, { useState } from 'react';
import { Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../store/usersSlices';
import { adminCreateUser } from '../../api/backendConn/users';
import { hasPermission } from '../../lib/permissions';
import { RootState } from '../../store/index';

const CreateUserForm: React.FC = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const roles = useSelector((state: RootState) => state.roles.roles);

  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('');

  const handleCreateUser = async () => {
    if (!hasPermission(userRole, roles, 'createUser')) {
      alert('You do not have permission to create a user.');
      return;
    }

    const userData = { name: newUserName, email: newUserEmail, role: newUserRole };

    try {
      const createdUser = await adminCreateUser(userData);
      dispatch(addUser(createdUser.data));
      setNewUserName('');
      setNewUserEmail('');
      setNewUserRole('');
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to create user. Please try again.');
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
      <Typography variant="h6">Create New User</Typography>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <TextField
          label="User Name"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          fullWidth
        />
        <TextField
          label="User Email"
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel id="user-role-label">Role</InputLabel>
          <Select
            labelId="user-role-label"
            value={newUserRole}
            onChange={(e) => setNewUserRole(e.target.value)}
            label="Role"
          >
            {roles.map((role:any) => (
              <MenuItem key={role.id} value={role.name}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <Button variant="contained" color="primary" onClick={handleCreateUser} style={{ marginTop: '10px' }}>
        Create User
      </Button>
    </Paper>
  );
};

export default CreateUserForm;