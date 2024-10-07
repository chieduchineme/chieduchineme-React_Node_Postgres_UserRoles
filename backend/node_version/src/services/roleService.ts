import Role from '../models/roleModel'; 

export const createRole = async (name: string, permissions: string[]) => {
  if (!name || !Array.isArray(permissions)) {
    throw new Error('Invalid input: name and permissions must be provided');
  }

  const existingRole = await Role.findOne({ where: { name } });
  if (existingRole) {
    throw new Error(`Role with name ${name} already exists`);
  }

  return Role.create({ name, permissions });
};

export const deleteRoles = async (roleIds: string[]) => {
  const deletedRoles = await Role.destroy({
    where: {
      id: roleIds, // Use the IDs to find roles
    },
  });

  if (!deletedRoles) {
    throw new Error('No roles found with the provided IDs.');
  }

  return deletedRoles;
};


export const changeRoleName = async (roleId: number, newName: string) => {
  const role = await Role.findByPk(roleId);
  if (!role) throw new Error('Role not found');
  role.name = newName;
  await role.save();
  return role;
};

export const changeRolePermissions = async (roleId: number, newPermissions: string[]) => {
  const role = await Role.findByPk(roleId);
  if (!role) throw new Error('Role not found');
  role.permissions = newPermissions;
  await role.save();
  return role;
};

export const getAllRoles = async () => {
  return Role.findAll();
};
