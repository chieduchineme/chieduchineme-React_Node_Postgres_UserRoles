// src/pages/Home.tsx
import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { loadRoles } from '../store/rolesSlices';
import { fetchRoles } from '../api/backendConn/roles';

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user); // Accessing user from Redux store
  const dispatch = useDispatch();

  useEffect(() => {
    const loadRolesFromAPI = async () => {
      const rolesData = await fetchRoles(); // Fetch roles from API
      dispatch(loadRoles(rolesData.data)); // Dispatch the fetched roles
    };
    loadRolesFromAPI();
  }, [dispatch]);

  return (
    <div>
      <Typography variant="h3" gutterBottom>
        Welcome {user.name} to the User Management System
      </Typography>
      <Typography variant="body1">
        This application allows basic users to manage their profiles and settings. Admins have the ability to manage users, assign roles, and more.
      </Typography>
    </div>
  );
};

export default Home;
