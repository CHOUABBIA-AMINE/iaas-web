/**
 * Locality DTO
 * Data Transfer Object for Locality entity
 * Supports multilingual names with Ar, En, Fr suffixes
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
 * Get localized name for Locality based on current language
 * @param locality - Locality object with multilingual names
 * @param language - Current language code ('ar', 'en', 'fr')
 * @returns Localized name or fallback to English
 */
export const getLocalityLocalizedName = (locality: LocalityDTO, language: string): string => {
  if (!locality) return '';
  
  const lang = language.toLowerCase();
  
  switch (lang) {
    case 'ar':
      return locality.nameAr || locality.nameEn || locality.nameFr || '';
    case 'fr':
      return locality.nameFr || locality.nameEn || locality.nameAr || '';
    case 'en':
    default:
      return locality.nameEn || locality.nameFr || locality.nameAr || '';
  }
};
