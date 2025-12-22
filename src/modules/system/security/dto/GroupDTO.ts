/**
 * Group DTO
 * Matches: dz.mdn.iaas.system.security.dto.GroupDTO
 * Entity: T_00_02_01
 */

import { RoleDTO } from './RoleDTO'

export interface GroupDTO {
  id?: number
  name: string
  description?: string
  roles?: RoleDTO[]
}
