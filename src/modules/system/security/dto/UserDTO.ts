/**
 * User DTO
 * Matches: dz.mdn.iaas.system.security.dto.UserDTO
 * Entity: T_00_02_02
 */

import { RoleDTO } from './RoleDTO'
import { GroupDTO } from './GroupDTO'

export interface UserDTO {
  id?: number
  username: string
  email: string
  password?: string
  accountNonExpired?: boolean
  accountNonLocked?: boolean
  credentialsNonExpired?: boolean
  enabled?: boolean
  roles?: RoleDTO[]
  groups?: GroupDTO[]
}
