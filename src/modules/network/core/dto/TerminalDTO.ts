/**
 * Terminal DTO
 * Data Transfer Object for Terminal entity
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 * @updated 12-23-2025
 */

import { VendorDTO } from '../../common/dto';
import { OperationalStatusDTO } from '../../common/dto';
import { TerminalTypeDTO } from '../../type/dto';
import { StateDTO, LocalityDTO } from '../../../common/administration/dto';

export interface TerminalDTO {
  id: number;
  code: string;
  name: string;
  placeName: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  installationDate?: string;
  commissioningDate?: string;
  decommissioningDate?: string;
  
  // IDs for relations
  operationalStatusId: number;
  vendorId: number;
  stateId: number;
  localityId: number;
  terminalTypeId: number;
  
  // Nested objects (from backend)
  operationalStatus?: OperationalStatusDTO;
  vendor?: VendorDTO;
  state?: StateDTO;
  locality?: LocalityDTO;
  terminalType?: TerminalTypeDTO;
  
  // Legacy string fields (fallback)
  operationalStatusName?: string;
  vendorName?: string;
  stateName?: string;
  localityName?: string;
  terminalTypeName?: string;
  
  pipelineIds?: number[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TerminalCreateDTO {
  code: string;
  name: string;
  placeName: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  installationDate?: string;
  commissioningDate?: string;
  decommissioningDate?: string;
  operationalStatusId: number;
  vendorId: number;
  stateId: number;
  localityId: number;
  terminalTypeId: number;
}
