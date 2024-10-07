import React from 'react';
import { TableRow, TableCell, Checkbox } from '@mui/material';
import { UserRowProps } from '@/types/userTypes';

const UserRow: React.FC<UserRowProps> = ({ user, isSelected, onSelectUser, isCurrentUser }) => {
  return (
    <TableRow key={user.id}>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onChange={() => onSelectUser(user.id)}
          disabled={isCurrentUser}
        />
      </TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.role}</TableCell>
    </TableRow>
  );
};

export default UserRow;