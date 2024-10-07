import axiosInstance from '../clients/axios';
// api/users.ts

// Fetch user profile by email
export const fetchProfile = async (email: string) => {
    const response = await axiosInstance.get(`/users/${email}`);
    return { data: response.data }; // Return serializable data
};

// Fetch all users
export const fetchUsers = async () => {
    const response = await axiosInstance.get('/users');
    return { data: response.data }; // Return serializable data
};

// Admin route to create a new user
export const adminCreateUser = async (userData: any) => {
    const response = await axiosInstance.post('/users', userData);
    return { data: response.data }; // Return serializable data
};

// Admin route to delete a user instead of adminDeleteUser and deleteRole, replace with instead of adminDeleteUsers and deleteRoles which takes in array of strings instead
export const adminDeleteUsers = async (userIds: string[]) => {
    const response = await axiosInstance.delete('/users', {
        data: { userIds }  // Send userIds in the request body
    });
    return { data: response.data }; // Return serializable data
};

// Admin route to assign a role to a user
export const assignRole = async (userId: string, role: string) => {
    const response = await axiosInstance.patch(`/users/${userId}/role`, { role });
    return { data: response.data }; // Return serializable data
};
