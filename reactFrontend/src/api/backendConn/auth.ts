import axiosInstance from '../clients/axios';

// Google login
export const loginWithGoogle = async (token: string) => {
    const response = await axiosInstance.post('/auth/login/google', { token });
    return { data: response.data }; // Return serializable data
};

// Microsoft login
export const loginWithMicrosoft = async (token: string) => {
    const response = await axiosInstance.post('/auth/login/microsoft', { token });
    return { data: response.data }; // Return serializable data
};