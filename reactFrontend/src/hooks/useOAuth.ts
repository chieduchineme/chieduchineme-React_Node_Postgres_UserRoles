// hooks/useOAuth.ts
import { useMsal } from '@azure/msal-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import { loginWithGoogle, loginWithMicrosoft } from '../api/backendConn/auth';

export const useOAuth = () => {
    const { instance } = useMsal();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle Microsoft login
    const handleMicrosoftLogin = () => {
        const loginRequest = {
            scopes: ["user.read"], // Specify required scopes
        };

        instance.loginPopup(loginRequest)
            .then(async (loginResponse) => {
                const token = loginResponse.accessToken;
                const user = await loginWithMicrosoft(token);
                
                // Dispatch user data to the Redux store
                dispatch(login({ user: user.data, token }));
                
                // Redirect after successful login
                navigate('/');
            })
            .catch((error) => {
                console.error("Microsoft Login Failed:", error);
            });
    };

    // Handle Google login
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const token = tokenResponse.access_token;
            const user = await loginWithGoogle(token);
            
            // Dispatch user data to the Redux store
            dispatch(login({ user: user.data, token }));
            
            // Redirect after successful login
            navigate('/');
        },
        onError: (error) => {
            console.error("Google Login Failed:", error);
        },
    });

    return {
        handleGoogleLogin,
        handleMicrosoftLogin
    };
};