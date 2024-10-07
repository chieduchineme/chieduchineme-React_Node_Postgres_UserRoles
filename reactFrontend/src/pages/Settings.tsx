import React, { useState } from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import ManageRoles from '../features/manageRoles';
import ManageUsers from '../features/manageUsers';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roles' | 'users' | null>(null);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f5f5" // Light background color
      p={3}
    >
      <Paper elevation={3} style={{ padding: '20px', width: '80%', maxWidth: '600px', borderRadius: '8px' }}>
        <Typography variant="h4" gutterBottom align="center">
          Settings
        </Typography>
        <Box display="flex" justifyContent="center" mb={2}>
          <Button
            variant="contained"
            onClick={() => setActiveTab('roles')}
            style={{ marginRight: '10px' }}
          >
            Manage Roles
          </Button>
          <Button variant="contained" onClick={() => setActiveTab('users')}>
            Manage Users
          </Button>
        </Box>

        {activeTab === 'roles' && <ManageRoles />}
        {activeTab === 'users' && <ManageUsers />}
      </Paper>
    </Box>
  );
};

export default Settings;
