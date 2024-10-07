// features/Auth/Login.tsx
import React from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import { useOAuth } from '../../hooks/useOAuth'; // Import the OAuth hook

const Login: React.FC = () => {
    const { handleGoogleLogin, handleMicrosoftLogin } = useOAuth(); // Destructure the login handlers

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f5f5f5"
            p={3}
        >
            <Paper elevation={4} style={{ padding: '30px', borderRadius: '10px', textAlign: 'center', width: '400px' }}>
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Choose a provider to login
                </Typography>
                <Box mt={3} mb={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleGoogleLogin()} // Wrap in an arrow function
                        fullWidth
                        style={{ marginBottom: '15px' }}
                    >
                        Login with Google
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleMicrosoftLogin}
                        fullWidth
                    >
                        Login with Microsoft
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default Login;
