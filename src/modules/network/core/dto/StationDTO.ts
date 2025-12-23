/**
 * Station DTO
 * Data Transfer Object for Station entity
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 * @updated 12-23-2025
 */

export interface StationDTO {
  id: number;
  name: string;
  code: string;
  description?: string;
  placeName: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  installationDate?: string;
  commissioningDate?: string;
  decommissioningDate?: string;
  operationalStatusId: number;
  operationalStatusName?: string;
  stationTypeId: number;
  stationTypeName?: string;
  pipelineSystemId?: number;
  pipelineSystemName?: string;
  vendorId: number;
  vendorName?: string;
  localityId: number;
  localityName?: string;
  pipelines?: any[];
  equipments?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface StationCreateDTO {
  name: string;
  code: string;
  description?: string;
  placeName: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  installationDate?: string;
  commissioningDate?: string;
  decommissioningDate?: string;
  operationalStatusId: number;
  stationTypeId: number;
  pipelineSystemId?: number;
  vendorId: number;
  localityId: number;
}

export interface StationUpdateDTO extends Partial<StationCreateDTO> {
  id: number;
}
