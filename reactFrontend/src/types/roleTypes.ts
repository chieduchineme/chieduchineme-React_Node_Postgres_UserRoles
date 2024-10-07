export interface Role {
    id: string;
    name: string;
    permissions: string[];
}

export interface RolesState {
    roles: Role[];
}

export interface DeleteRolesButtonProps {
    selectedRoles: string[];
    resetSelection: () => void;
  }

export interface RoleListProps {
    roles: { id: string, name: string, permissions: string[] }[];
    selectedRoles: string[];
    onSelectRole: (roleId: string) => void;
  }

export interface RoleRowProps {
    role: { id: string, name: string, permissions: string[] };
    isSelected: boolean;
    onSelectRole: (roleId: string) => void;
  }