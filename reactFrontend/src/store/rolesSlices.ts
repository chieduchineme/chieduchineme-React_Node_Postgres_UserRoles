// store/rolesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RolesState, Role } from '@/types/roleTypes';

const initialState: RolesState = {
    roles: [],
};

const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        loadRoles(state, action: PayloadAction<Role[]>) {
            state.roles = action.payload;
        },
        addRole(state, action: PayloadAction<Role>) {
            state.roles.push(action.payload);
        },
        removeRole(state, action: PayloadAction<string>) {
            state.roles = state.roles.filter(role => role.id !== action.payload);
        },
        // Remove multiple users by their IDs
        removeRoles(state, action: PayloadAction<string[]>) {
            state.roles = state.roles.filter(role => !action.payload.includes(role.id));
        },
        updateRolePermissions(state, action: PayloadAction<{ roleId: string; newPermissions: string[] }>) {
            const { roleId, newPermissions } = action.payload;
            const role = state.roles.find(role => role.id === roleId);
            if (role) {
                role.permissions = newPermissions;
            }
        },
    },
});

export const { loadRoles, addRole, removeRole, removeRoles, updateRolePermissions } = rolesSlice.actions;
export default rolesSlice.reducer;
