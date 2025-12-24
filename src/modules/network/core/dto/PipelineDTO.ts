/**
 * Pipeline DTO
 * Data Transfer Object for Pipeline entity
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 */

import { VendorDTO } from '../../common/dto';
import { OperationalStatusDTO } from '../../common/dto';
import { PipelineSystemDTO } from './PipelineSystemDTO';
import { AlloyDTO } from '../../common/dto';
import { ProductDTO } from '../../common/dto';

export interface PipelineDTO {
  id: number;
  name: string;
  code: string;
  description?: string;
  length?: number;
  diameter?: number;
  maximumOperatingPressure?: number;
  designPressure?: number;
  installationDate?: string;
  commissioningDate?: string;
  decommissioningDate?: string;
  
  // IDs for relations
  operationalStatusId: number;
  pipelineSystemId?: number;
  vendorId: number;
  alloyId?: number;
  productId?: number;
  
  // Nested objects (from backend)
  operationalStatus?: OperationalStatusDTO;
  pipelineSystem?: PipelineSystemDTO;
  vendor?: VendorDTO;
  alloy?: AlloyDTO;
  product?: ProductDTO;
  
  // Legacy string fields (fallback)
  operationalStatusName?: string;
  pipelineSystemName?: string;
  vendorName?: string;
  alloyName?: string;
  productName?: string;
  
  segments?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PipelineCreateDTO {
  name: string;
  code: string;
  description?: string;
  length?: number;
  diameter?: number;
  maximumOperatingPressure?: number;
  designPressure?: number;
  installationDate?: string;
  commissioningDate?: string;
  decommissioningDate?: string;
  operationalStatusId: number;
  pipelineSystemId?: number;
  vendorId: number;
  alloyId?: number;
  productId?: number;
}

export interface PipelineUpdateDTO extends Partial<PipelineCreateDTO> {
  id: number;
}
