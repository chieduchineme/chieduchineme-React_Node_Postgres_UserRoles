// router/AppRouter.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Layout from '../components/Layout/Layout';
import Login from '../components/Auth/Login';
import ProtectedRoute from '../components/RouteGuards/PrivateRoute';
import PrivateAdminRoute from '../components/RouteGuards/PrivateAdminRoute';

const AppRouter: React.FC = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/settings" element={<PrivateAdminRoute><Settings /></PrivateAdminRoute>} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default AppRouter;