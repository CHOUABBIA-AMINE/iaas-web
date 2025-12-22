/**
 * Permission DTO
 * Matches: dz.mdn.iaas.system.security.dto.PermissionDTO.java
 * Entity: T_00_02_04
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 */

export interface PermissionDTO {
  id?: number          // F_00: Long, primary key
  name: string         // F_01: varchar(100), unique, not null
  description?: string // F_02: varchar(200)
  resource?: string    // F_03: varchar(50)
  action?: string      // F_04: varchar(20)
}

/**
 * Create empty permission with default values
 */
export const createEmptyPermission = (): PermissionDTO => ({
  name: '',
  description: '',
  resource: '',
  action: '',
})
