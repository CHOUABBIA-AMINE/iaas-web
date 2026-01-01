/**
 * Region DTO
 * Data Transfer Object for Region entity
 *
 * Backend model: dz.mdn.iaas.network.common.model.Region
 *
 * @author CHOUABBIA Amine
 */

import { ZoneDTO } from './ZoneDTO';
import { ActivityDTO } from './ActivityDTO';

export interface RegionDTO {
  id: number;
  code: string;
  designationAr?: string;
  designationEn?: string;
  designationFr: string;
  descriptionAr?: string;
  descriptionEn?: string;
  descriptionFr?: string;
  zone: ZoneDTO;
  activity?: ActivityDTO | null;
}
