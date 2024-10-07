import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Paper } from '@mui/material';
import UserRow from './UserRow';
import { UserListProps } from '@/types/userTypes';


const UserList: React.FC<UserListProps> = ({ users, selectedUsers, onSelectUser, currentUserId }) => {
  return (
    <Paper elevation={3} style={{ padding: '20px' }}>
      <Typography variant="h6">User List</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Select</TableCell>
            <TableCell>User Name</TableCell>
            <TableCell>User Email</TableCell>
            <TableCell>User Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              isSelected={selectedUsers.includes(user.id)}
              onSelectUser={onSelectUser}
              isCurrentUser={user.id === currentUserId}
            />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default UserList;