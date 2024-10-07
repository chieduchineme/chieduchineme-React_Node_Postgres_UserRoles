// src/services/authService.ts
import { User } from '../models/userModel'; // Import User model
import Role from '../models/roleModel'; // Import Role model

// Find user by email or create a new user if they don't exist
export const handleOAuthLogin = async (email: any, name: any) => {
  // First, check if a user with the given email already exists
  console.log("handleOAuthLogin")
  let user = await User.findOne({ where: { email } });

  // If the user doesn't exist, create a new one
  if (!user) {
    // Find the default role, such as "regular"
    const defaultRole = await Role.findOne({ where: { name: 'regular' } });

    if (!defaultRole) {
      throw new Error('Default role not found');
    }

    // Create the new user with the default role
    user = await User.create({
      name,
      email,
      role: "regular",
    });
  }

  return user;
};
