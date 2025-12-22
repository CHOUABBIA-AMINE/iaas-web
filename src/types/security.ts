/**
 * Security Type Definitions
 * 
 * These interfaces match the backend DTOs exactly:
 * - UserDTO.java
 * - RoleDTO.java
 * - GroupDTO.java
 * - PermissionDTO.java
 * 
 * All entities extend GenericModel which provides:
 * - id: Long (mapped to F_00 column)
 * 
 * @author CHOUABBIA Amine
 * @updated 12-22-2025
 */

/**
 * Base interface for all DTOs
 * Matches GenericModel.java (id field)
 */
export interface BaseDTO {
  id?: number  // Corresponds to GenericModel.id (Long in Java)
}

/**
 * Permission DTO
 * Matches PermissionDTO.java
 * Entity: T_00_02_04
 */
export interface PermissionDTO extends BaseDTO {
  name: string              // F_01: varchar(100), unique, not null
  description?: string      // F_02: varchar(200), nullable
  resource?: string         // F_03: varchar(50), nullable
  action?: string          // F_04: varchar(20), nullable
}

/**
 * Role DTO
 * Matches RoleDTO.java
 * Entity: T_00_02_03
 */
export interface RoleDTO extends BaseDTO {
  name: string              // F_01: varchar(50), unique, not null
  description?: string      // F_02: varchar(200), nullable
  permissions?: PermissionDTO[]  // ManyToMany with Permission (R_T000203_T000204)
}

/**
 * Group DTO
 * Matches GroupDTO.java
 * Entity: T_00_02_01
 */
export interface GroupDTO extends BaseDTO {
  name: string              // F_01: varchar(50), unique, not null
  description?: string      // F_02: varchar(200), nullable
  roles?: RoleDTO[]        // ManyToMany with Role (R_T000201_T000203)
}

/**
 * User DTO
 * Matches UserDTO.java
 * Entity: T_00_02_02
 */
export interface UserDTO extends BaseDTO {
  username: string          // F_01: varchar(20), unique, not null
  email: string            // F_02: varchar(100), unique, not null
  password?: string        // F_03: varchar(100), write-only, not returned in responses
  
  // Account status flags (default: true)
  enabled?: boolean         // F_07: boolean, default true
  accountNonExpired?: boolean      // F_04: boolean, default true
  accountNonLocked?: boolean       // F_05: boolean, default true
  credentialsNonExpired?: boolean  // F_06: boolean, default true
  
  // Relationships
  roles?: RoleDTO[]        // ManyToMany with Role (R_T000202_T000203)
  groups?: GroupDTO[]      // ManyToMany with Group (R_T000202_T000201)
}

/**
 * Reset Password Request
 * Matches ResetPasswordRequest.java
 */
export interface ResetPasswordRequest {
  username: string      // Required, 3-20 characters
  newPassword: string   // Required, min 6 characters
}

/**
 * Authority DTO (for Spring Security GrantedAuthority)
 * Matches AuthorityDTO.java
 */
export interface AuthorityDTO {
  authority: string  // Spring Security authority name (e.g., "USER:READ")
}

/**
 * Type guards for runtime type checking
 */
export const isUserDTO = (obj: any): obj is UserDTO => {
  return obj && typeof obj.username === 'string' && typeof obj.email === 'string'
}

export const isRoleDTO = (obj: any): obj is RoleDTO => {
  return obj && typeof obj.name === 'string'
}

export const isGroupDTO = (obj: any): obj is GroupDTO => {
  return obj && typeof obj.name === 'string' && obj.roles !== undefined
}

export const isPermissionDTO = (obj: any): obj is PermissionDTO => {
  return obj && typeof obj.name === 'string'
}

/**
 * Helper functions for creating DTOs
 */
export const createEmptyUser = (): Partial<UserDTO> => ({
  username: '',
  email: '',
  password: '',
  enabled: true,
  accountNonExpired: true,
  accountNonLocked: true,
  credentialsNonExpired: true,
  roles: [],
  groups: [],
})

export const createEmptyRole = (): Partial<RoleDTO> => ({
  name: '',
  description: '',
  permissions: [],
})

export const createEmptyGroup = (): Partial<GroupDTO> => ({
  name: '',
  description: '',
  roles: [],
})

export const createEmptyPermission = (): Partial<PermissionDTO> => ({
  name: '',
  description: '',
  resource: '',
  action: '',
})

/**
 * Database Table Mapping Reference
 * 
 * T_00_02_01: Group
 * T_00_02_02: User
 * T_00_02_03: Role
 * T_00_02_04: Permission
 * 
 * R_T000202_T000203: User <-> Role (ManyToMany)
 * R_T000202_T000201: User <-> Group (ManyToMany)
 * R_T000201_T000203: Group <-> Role (ManyToMany)
 * R_T000203_T000204: Role <-> Permission (ManyToMany)
 * 
 * All entities have:
 * - F_00: id (Long, primary key, auto-increment)
 * - F_01: name (varchar, unique, not null) - except User which has username
 * - F_02: description/email (varchar, nullable)
 */
