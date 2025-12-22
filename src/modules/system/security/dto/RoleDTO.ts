/**
 * Role DTO
 * Matches: dz.mdn.iaas.system.security.dto.RoleDTO
 * Entity: T_00_02_03
 */

import { PermissionDTO } from './PermissionDTO'

export interface RoleDTO {
  id?: number
  name: string
  description?: string
  permissions?: PermissionDTO[]
}
