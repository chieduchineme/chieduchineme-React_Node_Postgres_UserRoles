// __tests__/roleController.test.ts
import request from 'supertest';
import express from 'express';
import { createRoleHandler, deleteRolesHandler, changeRoleNameHandler, changeRolePermissionsHandler, getAllRolesHandler } from '../../controllers/roleController';
import { createRole, deleteRoles, changeRoleName, changeRolePermissions, getAllRoles } from '../../services/roleService';

const app = express();
app.use(express.json());
app.post('/roles', createRoleHandler);
app.delete('/roles', deleteRolesHandler); 
app.patch('/roles/:roleId/name', changeRoleNameHandler);
app.patch('/roles/:roleId/permissions', changeRolePermissionsHandler);
app.get('/roles', getAllRolesHandler);

jest.mock('../services/roleService');

describe('Role Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create a new role', async () => {
    const mockRole = { id: 1, name: 'admin', permissions: ['read', 'write'] };
    (createRole as jest.Mock).mockResolvedValue(mockRole);

    const response = await request(app)
      .post('/roles')
      .send({ name: 'admin', permissions: ['read', 'write'] });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockRole);
    expect(createRole).toHaveBeenCalledWith('admin', ['read', 'write']);
  });

  test('should delete roles', async () => {
    (deleteRoles as jest.Mock).mockResolvedValue(undefined); // Mock for each role deletion

    const response = await request(app)
      .delete('/roles')
      .send({ ids: [1, 2] }); // Send an array of role IDs to delete

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Roles deleted successfully' });
    expect(deleteRoles).toHaveBeenCalledWith(1);
    expect(deleteRoles).toHaveBeenCalledWith(2);
    expect(deleteRoles).toHaveBeenCalledTimes(2); // Ensure it was called twice
  });

  test('should change the role name', async () => {
    const mockRole = { id: 1, name: 'superadmin', permissions: ['read', 'write'] };
    (changeRoleName as jest.Mock).mockResolvedValue(mockRole);

    const response = await request(app)
      .patch('/roles/1/name')
      .send({ newName: 'superadmin' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockRole);
    expect(changeRoleName).toHaveBeenCalledWith(1, 'superadmin');
  });

  test('should change role permissions', async () => {
    const mockRole = { id: 1, name: 'admin', permissions: ['read', 'write', 'delete'] };
    (changeRolePermissions as jest.Mock).mockResolvedValue(mockRole);

    const response = await request(app)
      .patch('/roles/1/permissions')
      .send({ newPermissions: ['read', 'write', 'delete'] });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockRole);
    expect(changeRolePermissions).toHaveBeenCalledWith(1, ['read', 'write', 'delete']);
  });

  test('should get all roles', async () => {
    const mockRoles = [
      { id: 1, name: 'admin', permissions: ['read', 'write'] },
      { id: 2, name: 'user', permissions: ['read'] },
    ];
    (getAllRoles as jest.Mock).mockResolvedValue(mockRoles);

    const response = await request(app)
      .get('/roles');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockRoles);
    expect(getAllRoles).toHaveBeenCalled();
  });
});
