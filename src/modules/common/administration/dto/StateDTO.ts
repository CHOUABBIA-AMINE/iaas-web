/**
 * State DTO
 * Data Transfer Object for State entity
 * Aligned with iaas repository structure
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 * @updated 12-23-2025
 */

export interface StateDTO {
  id: number;
  code: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Get localized name based on current language
 * @param state State object
 * @param language Current language code (ar, en, fr)
 * @returns Localized name
 */
export const getLocalizedStateName = (state: StateDTO, language: string): string => {
  switch (language.toLowerCase()) {
    case 'ar':
      return state.nameAr || state.nameEn || state.nameFr || state.code;
    case 'fr':
      return state.nameFr || state.nameEn || state.nameAr || state.code;
    case 'en':
    default:
      return state.nameEn || state.nameFr || state.nameAr || state.code;
  }
};
