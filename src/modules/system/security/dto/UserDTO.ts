/**
 * User DTO
 * Matches: dz.mdn.iaas.system.security.dto.UserDTO.java
 * Entity: T_00_02_02
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 */

import { RoleDTO } from './RoleDTO'
import { GroupDTO } from './GroupDTO'

export interface UserDTO {
  id?: number                      // F_00: Long, primary key
  username: string                 // F_01: varchar(20), unique, not null
  email: string                    // F_02: varchar(100), unique, not null
  password?: string                // F_03: varchar(100), write-only
  
  // Account status flags (default: true)
  accountNonExpired?: boolean      // F_04: boolean
  accountNonLocked?: boolean       // F_05: boolean
  credentialsNonExpired?: boolean  // F_06: boolean
  enabled?: boolean                // F_07: boolean
  
  // Relationships (ManyToMany)
  roles?: RoleDTO[]                // R_T000202_T000203
  groups?: GroupDTO[]              // R_T000202_T000201
}

/**
 * Create empty user with default values
 */
export const createEmptyUser = (): UserDTO => ({
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
