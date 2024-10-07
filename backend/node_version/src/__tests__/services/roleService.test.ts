// __tests__/roleService.test.ts
import {
  createRole,
  deleteRoles, 
  changeRoleName,
  changeRolePermissions,
  getAllRoles
} from '../../services/roleService';
import Role from '../../models/roleModel';

jest.mock('../models/roleModel');

describe('Role Service Tests', () => {
  beforeEach(() => {
      jest.clearAllMocks();
  });

  test('should create a role', async () => {
      const mockRole = { id: 1, name: 'admin', permissions: ['all'] };
      (Role.create as jest.Mock).mockResolvedValue(mockRole);

      const result = await createRole('admin', ['all']);
      expect(result).toEqual(mockRole);
      expect(Role.create).toHaveBeenCalledWith({ name: 'admin', permissions: ['all'] });
  });

  test('should delete multiple roles', async () => {
      const mockRoles = [
          { id: 1, destroy: jest.fn() },
          { id: 2, destroy: jest.fn() }
      ];
      (Role.findAll as jest.Mock).mockResolvedValue(mockRoles);

      await deleteRoles(['1', '2']);
      expect(mockRoles[0].destroy).toHaveBeenCalled();
      expect(mockRoles[1].destroy).toHaveBeenCalled();
  });

  test('should throw error when deleting non-existent roles', async () => {
      (Role.findAll as jest.Mock).mockResolvedValue([]);

      await expect(deleteRoles(['1', '2'])).rejects.toThrow('No roles found');
  });

  test('should change role name', async () => {
      const mockRole = { id: 1, name: 'oldName', save: jest.fn() };
      (Role.findByPk as jest.Mock).mockResolvedValue(mockRole);

      const result = await changeRoleName(1, 'newName');
      expect(result.name).toBe('newName');
      expect(mockRole.save).toHaveBeenCalled();
  });

  test('should throw error when changing name of non-existent role', async () => {
      (Role.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(changeRoleName(1, 'newName')).rejects.toThrow('Role not found');
  });

  test('should change role permissions', async () => {
      const mockRole = { id: 1, permissions: [], save: jest.fn() };
      (Role.findByPk as jest.Mock).mockResolvedValue(mockRole);

      const result = await changeRolePermissions(1, ['read', 'write']);
      expect(result.permissions).toEqual(['read', 'write']);
      expect(mockRole.save).toHaveBeenCalled();
  });

  test('should throw error when changing permissions of non-existent role', async () => {
      (Role.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(changeRolePermissions(1, ['read'])).rejects.toThrow('Role not found');
  });

  test('should get all roles', async () => {
      const mockRoles = [{ id: 1, name: 'admin' }, { id: 2, name: 'user' }];
      (Role.findAll as jest.Mock).mockResolvedValue(mockRoles);

      const result = await getAllRoles();
      expect(result).toEqual(mockRoles);
  });
});
