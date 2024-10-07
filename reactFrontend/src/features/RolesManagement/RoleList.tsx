import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import RoleRow from './RoleRow';
import { RoleListProps } from '@/types/roleTypes';

const RoleList: React.FC<RoleListProps> = ({ roles, selectedRoles, onSelectRole }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Select</TableCell>
          <TableCell>Role Name</TableCell>
          <TableCell>Permissions</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {roles.map((role) => (
          <RoleRow
            key={role.id}
            role={role}
            isSelected={selectedRoles.includes(role.id)}
            onSelectRole={onSelectRole}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default RoleList;