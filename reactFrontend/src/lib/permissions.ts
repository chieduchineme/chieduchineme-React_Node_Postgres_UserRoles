export const hasPermission = (userRole: string, roles: any, permissionId: string): boolean => {
  if (!userRole) {
    // If no role is provided, deny permission
    return false;
  }

  // Find the current user's role object
  const role = roles.find((role: { name: string; }) => role.name === userRole);

  if (!role) {
    // If the role is not found, deny permission
    return false;
  }

  const rolePermissions = role.permissions; // Assuming role.permissions is an array of permission strings

  // Check if the current user is an admin or has 'all' permissions
  if (userRole.toLowerCase() == 'admin' || rolePermissions.includes('all')) {
    return true; // Admins or roles with 'all' permissions have access to everything
  }

  // Check if the user role has the required permission
  const hasPermission = rolePermissions.includes(permissionId);
  return hasPermission;
};
