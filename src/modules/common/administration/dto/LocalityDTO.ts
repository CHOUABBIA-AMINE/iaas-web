/**
 * Locality DTO
 * Data Transfer Object for Locality entity
 * Aligned with iaas repository structure
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 * @updated 12-23-2025
 */

import { StateDTO } from './StateDTO';

export interface LocalityDTO {
  id: number;
  code: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  stateId: number;
  state?: StateDTO;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Get localized name based on current language
 * @param locality Locality object
 * @param language Current language code (ar, en, fr)
 * @returns Localized name
 */
export const getLocalizedLocalityName = (locality: LocalityDTO, language: string): string => {
  switch (language.toLowerCase()) {
    case 'ar':
      return locality.nameAr || locality.nameEn || locality.nameFr || locality.code;
    case 'fr':
      return locality.nameFr || locality.nameEn || locality.nameAr || locality.code;
    case 'en':
    default:
      return locality.nameEn || locality.nameFr || locality.nameAr || locality.code;
  }
};
