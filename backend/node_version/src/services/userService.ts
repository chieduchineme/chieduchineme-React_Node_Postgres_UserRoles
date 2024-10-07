import { User} from '../models/userModel';

export const addUser = async (email: string, name: string, role: string) => {
  if (!email || !name || !role) {
    throw new Error('Missing required fields: email, name, and role must all be provided');
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error(`User with email ${email} already exists`);
  }

  return User.create({ email, name, role });
};

export const deleteUsers = async (userIds: string[]) => {
  const deletedUsers = await User.destroy({
    where: {
      id: userIds, // Use the IDs to find users
    },
  });

  if (!deletedUsers) {
    throw new Error('No users found with the provided IDs.');
  }

  return deletedUsers;
}

export const assignRoleToUser = async (userId: string, role: string) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');
  user.role = role; 
  await user.save();
};

export const getUsers = async () => {
  const users = await User.findAll();
  return users;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const user = await User.findOne({ where: { email } });
  return user;
};
