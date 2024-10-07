// controllers/authController.ts
import { Request, Response } from 'express';
import { handleOAuthLogin } from '../services/authService';
import { verifyGoogleToken, verifyMicrosoftToken } from '../services/tokenService'; 

// Google login route
export const googleLogin = async (req: Request, res: Response) => {
  const { token } = req.body; // Extract the token from the request body
  try {
    const { email, name } = await verifyGoogleToken(token); // Verify token and extract user info

    if(email == null || name == null){
      res.status(400).json({ message: "Please sign up with Google" });
    }

    const user = await handleOAuthLogin(email, name);
    // Initialize session user data
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Microsoft login route
export const microsoftLogin = async (req: Request, res: Response) => {
  const { token } = req.body; // Extract the token from the request body

  try {
    const { email, name } = await verifyMicrosoftToken(token); // Verify token and extract user info

    if(email == null || name == null){
      res.status(400).json({ message: "Please sign up with Microsoft" });
    }

    const user = await handleOAuthLogin(email, name);

    // Initialize session user data
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role, 
    };
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req: Request, res: Response) => {
  // Clear the session and send a response
  req.session.destroy((err) => {
      if (err) {
          return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.status(200).json({ message: 'Logged out successfully' });
  });
};
