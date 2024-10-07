// components/Layout.tsx
import React, { ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Logout from '../Auth/Logout';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <div>
            {/* Only render the AppBar if the user is logged in */}
            {user && (
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" style={{ flexGrow: 1 }}>
                            User Management System
                        </Typography>
                        <Button color="inherit" component={Link} to="/profile">Profile</Button>
                        
                        {/* Settings button visible only for admin */}
                        {user.role === 'admin' && (
                            <Button color="inherit" component={Link} to="/settings">Settings</Button>
                        )}
                        
                        <Logout />
                    </Toolbar>
                </AppBar>
            )}
            <div>{children}</div>
        </div>
    );
};

export default Layout;
