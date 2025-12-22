/**
 * Group DTO
 * Matches: dz.mdn.iaas.system.security.dto.GroupDTO.java
 * Entity: T_00_02_01
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 */

import { RoleDTO } from './RoleDTO'

export interface GroupDTO {
  id?: number          // F_00: Long, primary key
  name: string         // F_01: varchar(50), unique, not null
  description?: string // F_02: varchar(200)
  
  // Relationships (ManyToMany)
  roles?: RoleDTO[]    // R_T000201_T000203
}

/**
 * Create empty group with default values
 */
export const createEmptyGroup = (): GroupDTO => ({
  name: '',
  description: '',
  roles: [],
})
