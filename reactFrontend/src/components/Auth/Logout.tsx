// components/Logout.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout as logoutAction } from '../../store/authSlice';
import axiosInstance from '../../api/clients/axios';
import { Button } from '@mui/material';

const Logout: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle Logout
    const handleLogout = async () => {
        try {
            await axiosInstance.post('/auth/logout'); // Send logout request to backend
            dispatch(logoutAction()); // Dispatch the logout action to clear Redux state
            navigate('/login'); // Redirect to the login page after logout
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <Button color="inherit" onClick={handleLogout}>
            Logout
        </Button>
    );
};

export default Logout;