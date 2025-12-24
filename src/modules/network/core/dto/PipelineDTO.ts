/**
 * Pipeline DTO
 * Data Transfer Object for Pipeline entity
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 * @updated 12-24-2025
 */

import { VendorDTO } from '../../common/dto';
import { OperationalStatusDTO } from '../../common/dto';
import { PipelineSystemDTO } from './PipelineSystemDTO';

export interface PipelineDTO {
  id: number;
  code: string;
  name: string;
  installationDate?: string;
  commissioningDate?: string;
  decommissioningDate?: string;
  
  // Technical specifications
  nominalDiameter?: number;
  length?: number;
  nominalThickness?: number;
  nominalRoughness?: number;
  
  // Pressure specifications
  designMaxServicePressure?: number;
  operationalMaxServicePressure?: number;
  designMinServicePressure?: number;
  operationalMinServicePressure?: number;
  
  // Capacity specifications
  designCapacity?: number;
  operationalCapacity?: number;
  
  // Material and coating
  nominalConstructionMaterial?: string;
  nominalExteriorCoating?: string;
  nominalInteriorCoating?: string;
  
  // Relations - IDs
  operationalStatusId: number;
  vendorId: number;
  pipelineSystemId?: number;
  departureFacilityId?: number;
  arrivalFacilityId?: number;
  
  // Nested objects (from backend)
  operationalStatus?: OperationalStatusDTO;
  vendor?: VendorDTO;
  pipelineSystem?: PipelineSystemDTO;
  departureFacility?: any;
  arrivalFacility?: any;
  
  // Legacy string fields (fallback)
  operationalStatusName?: string;
  vendorName?: string;
  pipelineSystemName?: string;
  departureFacilityName?: string;
  arrivalFacilityName?: string;
  
  createdAt?: string;
  updatedAt?: string;
}

export interface PipelineCreateDTO {
  code: string;
  name: string;
  installationDate?: string;
  commissioningDate?: string;
  decommissioningDate?: string;
  
  nominalDiameter?: number;
  length?: number;
  nominalThickness?: number;
  nominalRoughness?: number;
  
  designMaxServicePressure?: number;
  operationalMaxServicePressure?: number;
  designMinServicePressure?: number;
  operationalMinServicePressure?: number;
  
  designCapacity?: number;
  operationalCapacity?: number;
  
  nominalConstructionMaterial?: string;
  nominalExteriorCoating?: string;
  nominalInteriorCoating?: string;
  
  operationalStatusId: number;
  vendorId: number;
  pipelineSystemId?: number;
  departureFacilityId?: number;
  arrivalFacilityId?: number;
}

export interface PipelineUpdateDTO extends Partial<PipelineCreateDTO> {
  id: number;
}
