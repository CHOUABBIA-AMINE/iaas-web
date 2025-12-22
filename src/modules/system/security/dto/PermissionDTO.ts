/**
 * Permission DTO
 * Matches: dz.mdn.iaas.system.security.dto.PermissionDTO
 * Entity: T_00_02_04
 */

export interface PermissionDTO {
  id?: number
  name: string
  description?: string
  resource?: string
  action?: string
}
