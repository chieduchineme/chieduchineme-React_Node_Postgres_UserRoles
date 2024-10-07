// controllers/roleController.ts
import { Request, Response } from 'express';
import { createRole, deleteRoles, changeRoleName, changeRolePermissions, getAllRoles } from '../services/roleService';

export const createRoleHandler = async (req: Request, res: Response) => {
  const { name, permissions } = req.body;

  try {
    const newRole = await createRole(name, permissions);
    res.json(newRole);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRolesHandler = async (req: Request, res: Response) => {
  const { roleIds } = req.body; // Expecting an array of role IDs

  // Validate input
  if (!roleIds || !Array.isArray(roleIds)) {
    res.status(400).json({ message: 'roleIds is required and should be an array.' });
  }

  try {
    await deleteRoles(roleIds);
    res.json({ message: 'Roles deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const changeRoleNameHandler = async (req: Request, res: Response) => {
  const { roleId } = req.params;
  const { newName } = req.body;

  try {
    const updatedRole = await changeRoleName(Number(roleId), newName);
    res.json(updatedRole);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const changeRolePermissionsHandler = async (req: Request, res: Response) => {
  const { roleId } = req.params;
  const { newPermissions } = req.body;

  try {
    const updatedRole = await changeRolePermissions(Number(roleId), newPermissions);
    res.json(updatedRole);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllRolesHandler = async (req: Request, res: Response) => {
  try {
    const roles = await getAllRoles();
    res.json(roles);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
