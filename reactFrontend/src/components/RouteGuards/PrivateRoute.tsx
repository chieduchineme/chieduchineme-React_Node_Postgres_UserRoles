// features/Auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/index';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const user = useSelector((state: RootState) => state.auth.user);

    if (!user) {
        // If user is not logged in, redirect to login page
        return <Navigate to="/login" />;
    }

    return <>{children}</>; // If authenticated, render the children components
};

export default ProtectedRoute;
