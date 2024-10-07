// server/src/services/tokenService.ts
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';


// Verify Google OAuth Access Token by calling Google People API
export const verifyGoogleToken = async (token: string) => {
  try {
    // Use Google People API to get user info
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error('Invalid Google OAuth token.');
    }

    const { email, name } = response.data; // Extract user info from the response
    return { email, name }; // Return the user info
  } catch (error) {
    throw new Error('Failed to verify Google OAuth token.');
  }
};

// Verify Microsoft Token
export const verifyMicrosoftToken = async (token: string) => {
  const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) {
    throw new Error('Invalid Microsoft token.');
  }

  const { mail, displayName } = response.data; // Extract user information from the response
  return { email: mail, name: displayName }; // Return extracted information
};