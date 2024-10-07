import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import usersReducer from './usersSlices';
import rolesReducer from './rolesSlices';

const store = configureStore({
    reducer: {
        auth: authReducer,
        users: usersReducer,
        roles: rolesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
