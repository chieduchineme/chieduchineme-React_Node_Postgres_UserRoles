import axios from 'axios';

// Define the base URL for your API
const API_URL = 'http://localhost:5000';

// Create an Axios instance and set global defaults
const axiosInstance = axios.create({
    baseURL: API_URL,         // Base URL of your API
    withCredentials: true,    // Ensures cookies (session ID) are sent with each request
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
