/**
 * PipelineSystem DTO
 * Data Transfer Object for PipelineSystem entity
 * 
 * Backend model: dz.mdn.iaas.network.core.model.PipelineSystem
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 * @updated 01-01-2026 - Align with backend (code, name, product, operationalStatus, region)
 */

import { ProductDTO, OperationalStatusDTO, RegionDTO } from '../../common/dto';

export interface PipelineSystemDTO {
  id: number;
  code: string;
  name: string;
  product: ProductDTO;
  operationalStatus: OperationalStatusDTO;
  region: RegionDTO;
}
