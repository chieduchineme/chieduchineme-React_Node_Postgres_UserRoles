// components/Profile.tsx
import React from 'react';
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Profile: React.FC = () => {
    // Fetch user data from Redux store
    const user = useSelector((state: RootState) => state.auth.user);

    if (!user) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f5f5f5"
            p={2}
        >
            <Card sx={{ width: 400, textAlign: 'center', padding: '20px' }}>
                <Avatar
                    sx={{ 
                        width: 100, 
                        height: 100, 
                        margin: '0 auto', 
                        bgcolor: '#1976d2', 
                        fontSize: '36px' 
                    }}
                >
                    {user.name.charAt(0)}
                </Avatar>
                <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                        {user.name}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                        {user.email}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                            backgroundColor: '#e0f7fa',
                            padding: '5px',
                            borderRadius: '4px',
                            display: 'inline-block',
                            fontWeight: user.role.toLowerCase() === 'admin' ? 'bold' : 'normal', // Bold for Admin
                        }}
                    >
                        Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Profile;
