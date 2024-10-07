import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UsersState, User } from '@/types/userTypes';

const initialState: UsersState = {
  users: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    loadUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
    },
    addUser(state, action: PayloadAction<User>) {
      state.users.push(action.payload);
    },
    // Remove a single user
    removeUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    // Remove multiple users by their IDs
    removeUsers(state, action: PayloadAction<string[]>) {
      state.users = state.users.filter(user => !action.payload.includes(user.id));
    },
  },
});

export const { loadUsers, addUser, removeUser, removeUsers } = usersSlice.actions;
export default usersSlice.reducer;
