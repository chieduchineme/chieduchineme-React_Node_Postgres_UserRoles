// types/userTypes.ts
export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }
  
export interface UsersState {
    users: User[];
  }
 
export interface DeleteUsersButtonProps {
    selectedUsers: string[];
    currentUserId: string;
    resetSelection: () => void;
  }

export interface UserListProps {
    users: { id: string, name: string, email: string, role: string }[];
    selectedUsers: string[];
    onSelectUser: (userId: string) => void;
    currentUserId: string;
  }

export interface UserRowProps {
  user: { id: string, name: string, email: string, role: string };
  isSelected: boolean;
  onSelectUser: (userId: string) => void;
  isCurrentUser: boolean;
}
