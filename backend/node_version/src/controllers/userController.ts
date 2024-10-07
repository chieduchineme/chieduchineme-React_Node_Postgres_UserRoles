// controllers/userController.ts
import { Request, Response } from 'express';
import { addUser, deleteUsers, findUserByEmail, assignRoleToUser, getUsers as fetchUsers} from '../services/userService';

export const createUser = async (req: Request, res: Response) => {
  const { email, name, role } = req.body;

  try {
    const user = await addUser(email, name, role);
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const removeUsers = async (req: Request, res: Response) => {
  const { userIds } = req.body; // Expecting an array of user IDs

  // Validate input
  if (!userIds || !Array.isArray(userIds)) {
    res.status(400).json({ message: 'userIds is required and should be an array.' });
  }

  try {
    await deleteUsers(userIds);
    res.json({ message: 'Users deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const getUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.params;

  try {
    await findUserByEmail(email);
    res.json({ message: 'User found successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const changeUserRole = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    await assignRoleToUser(userId, role);
    res.json({ message: 'Role updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await fetchUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
