import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface PrivateAdminRouteProps {
    children: React.ReactNode;
}

const PrivateAdminRoute: React.FC<PrivateAdminRouteProps> = ({ children }) => {
    const currentUser = useSelector((state: RootState) => state.auth.user);

    // Check if the user is logged in and has the 'admin' role
    if (!currentUser) {
        // Redirect to login if the user is not logged in
        return <Navigate to="/login" />;
    }

    if (currentUser.role !== 'admin') {
        // Redirect to profile page if the user is not an admin
        return <Navigate to="/profile" />;
    }

    // If the user is an admin, render the children components
    return <>{children}</>;
};

export default PrivateAdminRoute;
