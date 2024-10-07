// middleware/authMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';

export const authMiddleware: Middleware = () => next => action => {

    const token = localStorage.getItem('authToken');
    if (!token && action.type.startsWith('admin')) {
        console.warn('Unauthorized admin action');
        return;
    }
    return next(action);
};
