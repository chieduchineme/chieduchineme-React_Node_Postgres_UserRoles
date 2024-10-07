// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   Button,
//   TextField,
//   Checkbox,
//   FormControlLabel,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
// } from '@mui/material';
// import { loadRoles, addRole, removeRoles, updateRolePermissions } from '../store/rolesSlices';
// import { fetchRoles, createRole, deleteRoles, changeRolePermissions } from '../api/backendConn/auth';
// import { RootState } from '../store';
// import { hasPermission } from '../lib/permissions'; // Import the permission utility
// import permissionsData from '../permission.json'; // Import permissions data

// const ManageRoles: React.FC = () => {
//   const dispatch = useDispatch();
//   const userRole = useSelector((state: RootState) => state.auth.user?.role);
//   const roles = useSelector((state: RootState) => state.roles.roles);
  
//   const [newRoleName, setNewRoleName] = useState('');
//   const [newPermissions, setNewPermissions] = useState<string[]>([]);
//   const [editRoleId, setEditRoleId] = useState<string | null>(null);
//   const [editedPermissions, setEditedPermissions] = useState<Record<string, string[]>>({});
//   const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

//   useEffect(() => {
//     const loadRolesFromAPI = async () => {
//       const rolesData = await fetchRoles(); // Fetch roles from API
//       dispatch(loadRoles(rolesData.data)); // Dispatch the fetched roles
//     };
//     loadRolesFromAPI();
//   }, [dispatch]);

//   const handleCreateRole = async () => {
//     if (!hasPermission(userRole, roles, 'createRole')) {
//       alert('You do not have permission to create a role.');
//       return;
//     }
//     const roleData = { name: newRoleName, permissions: newPermissions };
//     const createdRole = await createRole(roleData); // Call the API to create the role
//     dispatch(addRole(createdRole.data)); // Dispatch the action to add the role to Redux
//     setNewRoleName('');
//     setNewPermissions([]);
//   };

//   const handleDeleteRoles = async () => {
//     if (!hasPermission(userRole, roles, 'deleteRole')) {
//       alert('You do not have permission to delete roles.');
//       return;
//     }

//     await deleteRoles(selectedRoles); // Call the API to delete multiple roles
//     dispatch(removeRoles(selectedRoles)); // Dispatch the action to remove the roles from Redux
//     setSelectedRoles([]); // Clear the selected roles
//   };

//   const handleToggleEdit = (roleId: string) => {
//     setEditRoleId(editRoleId === roleId ? null : roleId);
//     setEditedPermissions({ ...editedPermissions, [roleId]: roles.find(role => role.id === roleId)?.permissions || [] });
//   };

//   const handleChangePermissions = (roleId: string, permission: string) => {
//     if (!hasPermission(userRole, roles, 'editRole')) {
//       alert('You do not have permission to change permissions.');
//       return;
//     }

//     const currentPermissions = editedPermissions[roleId] || [];
//     const updatedPermissions = currentPermissions.includes(permission)
//       ? currentPermissions.filter(perm => perm !== permission)
//       : [...currentPermissions, permission];
//     setEditedPermissions({ ...editedPermissions, [roleId]: updatedPermissions });
//   };

//   const handleSavePermissions = async (roleId: string) => {
//     if (!hasPermission(userRole, roles, 'editRole')) {
//       alert('You do not have permission to save permissions.');
//       return;
//     }

//     const newPermissions = editedPermissions[roleId];
//     await changeRolePermissions(roleId, newPermissions); // Call the API to change role permissions
//     dispatch(updateRolePermissions({ roleId, newPermissions })); // Dispatch the action to update permissions in Redux
//     setEditRoleId(null);
//   };

//   const handleSelectRole = (roleId: string) => {
//     setSelectedRoles(selectedRoles.includes(roleId)
//       ? selectedRoles.filter(id => id !== roleId)
//       : [...selectedRoles, roleId]);
//   };

//   return (
//     <div>
//       <Typography variant="h4">Manage Roles</Typography>

//       <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//         <TextField
//           label="New Role Name"
//           value={newRoleName}
//           onChange={(e) => setNewRoleName(e.target.value)}
//           style={{ marginRight: '10px' }} // Margin between fields
//         />
//         <FormControl style={{ marginRight: '10px', width: '200px' }}>
//           <InputLabel>Permissions</InputLabel>
//           <Select
//             multiple
//             value={newPermissions}
//             onChange={(e) => setNewPermissions(e.target.value as string[])}
//             renderValue={(selected) => selected.join(', ')}
//           >
//             {permissionsData.permissions.map(permission => (
//               <MenuItem key={permission.id} value={permission.id}>
//                 <Checkbox checked={newPermissions.indexOf(permission.id) > -1} />
//                 {permission.permissionText}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         <Button variant="contained" onClick={handleCreateRole} disabled={!hasPermission(userRole, roles, 'createRole')}>
//           Create Role
//         </Button>
//       </div>

//       <Table style={{ marginTop: '20px' }}>
//         <TableHead>
//           <TableRow>
//             <TableCell>Select</TableCell>
//             <TableCell>Role Name</TableCell>
//             <TableCell>Permissions</TableCell>
//             <TableCell>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {roles.map((role) => (
//             <TableRow key={role.id}>
//               <TableCell>
//                 <Checkbox 
//                   checked={selectedRoles.includes(role.id)} 
//                   onChange={() => handleSelectRole(role.id)} 
//                   disabled={role.name === 'admin'} // Disable checkbox for admin role
//                 />
//               </TableCell>
//               <TableCell>{role.name}</TableCell>
//               <TableCell>
//                 {editRoleId === role.id ? (
//                   permissionsData.permissions.map(permission => (
//                     <FormControlLabel
//                       key={permission.id}
//                       control={
//                         <Checkbox
//                           checked={editedPermissions[role.id]?.includes(permission.id)}
//                           onChange={() => handleChangePermissions(role.id, permission.id)}
//                         />
//                       }
//                       label={permission.permissionText}
//                     />
//                   ))
//                 ) : (
//                   role.permissions.join(', ')
//                 )}
//               </TableCell>
//               <TableCell>
//                 {editRoleId === role.id ? (
//                   <>
//                     <Button variant="outlined" onClick={() => handleSavePermissions(role.id)}>Save</Button>
//                     <Button variant="outlined" onClick={() => setEditRoleId(null)}>Cancel</Button>
//                   </>
//                 ) : (
//                   <>
//                     <Button 
//                       variant="outlined" 
//                       onClick={() => handleToggleEdit(role.id)} 
//                       disabled={!hasPermission(userRole, roles, 'editRole') || role.name === 'admin'} // Disable edit button for admin role
//                     >
//                       Edit
//                     </Button>
//                   </>
//                 )}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       {/* Batch delete button below the table */}
//       {selectedRoles.length > 0 && (
//         <Button 
//           variant="contained" 
//           color="error" 
//           onClick={handleDeleteRoles} 
//           disabled={!hasPermission(userRole, roles, 'deleteRole')}
//           style={{ marginTop: '10px' }}
//         >
//           Delete Selected Roles
//         </Button>
//       )}
//     </div>
//   );
// };

// export default ManageRoles;







// /project-root
// |-- /config
// |   |-- db.ts
// |   |-- syncWithDb.ts
// |-- /controllers
// |   |-- authController.ts
// |   |-- roleController.ts
// |   |-- userController.ts
// |-- /middleware
// |   |-- authenticateMiddleware.ts
// |   |-- authorizeMiddleware.ts
// |-- /models
// |   |-- roleModel.ts
// |   |-- userModel.ts
// |-- /routes
// |   |-- roleRoutes.ts
// |   |-- authRoutes.ts
// |   |-- userRoutes.ts
// |-- /services
// |   |-- authService.ts
// |   |-- tokenService.ts
// |   |-- roleService.ts
// |   |-- userService.ts
// |-- __tests__
// |-- |-- /controllers
//     |   |-- roleController.ts
//     |   |-- userController.ts
//     |-- /middleware
//     |   |-- middleware.test.ts
// |--server.ts


