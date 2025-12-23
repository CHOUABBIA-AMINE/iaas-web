export interface UserDto {
  id?: number;
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isActive?: boolean;
  isLocked?: boolean;
  lastLoginDate?: string;
  createdDate?: string;
  groupIds?: number[];
  roleIds?: number[];
}
