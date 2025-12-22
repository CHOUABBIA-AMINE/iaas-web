/**
 * Role DTO
 * Matches: dz.mdn.iaas.system.security.dto.RoleDTO.java
 * Entity: T_00_02_03
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 */

import { PermissionDTO } from './PermissionDTO'

export interface RoleDTO {
  id?: number              // F_00: Long, primary key
  name: string             // F_01: varchar(50), unique, not null
  description?: string     // F_02: varchar(200)
  
  // Relationships (ManyToMany)
  permissions?: PermissionDTO[]  // R_T000203_T000204
}

/**
 * Create empty role with default values
 */
export const createEmptyRole = (): RoleDTO => ({
  name: '',
  description: '',
  permissions: [],
})
