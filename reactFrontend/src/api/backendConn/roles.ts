import axiosInstance from '../clients/axios';
// api/roles.ts

// Fetch all roles
export const fetchRoles = async () => {
    const response = await axiosInstance.get('/roles');
    return { data: response.data }; // Return serializable data
};

// Create a new role
export const createRole = async (roleData: any) => {
    const response = await axiosInstance.post('/roles', roleData);
    return { data: response.data }; // Return serializable data
};

// Delete a role
export const deleteRoles = async (roleIds: string[]) => {
    const response = await axiosInstance.delete('/roles', {
        data: { roleIds }  // Send roleIds in the request body
    });
    return { data: response.data }; // Return serializable data
};

// Change role name
export const changeRoleName = async (roleId: string, newName: string) => {
    const response = await axiosInstance.patch(`/roles/${roleId}/name`, { newName });
    return { data: response.data }; // Return serializable data
};

// Change role permissions
export const changeRolePermissions = async (roleId: string, newPermissions: string[]) => {
    const response = await axiosInstance.patch(`/roles/${roleId}/permissions`, { newPermissions });
    return { data: response.data }; // Return serializable data
};