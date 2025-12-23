/**
 * Terminal DTO
 * Data Transfer Object for Terminal entity
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 */

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
  operationalStatusId: number;
  operationalStatusName?: string;
  vendorId: number;
  vendorName?: string;
  localityId: number;
  localityName?: string;
  terminalTypeId: number;
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
  localityId: number;
  terminalTypeId: number;
}
