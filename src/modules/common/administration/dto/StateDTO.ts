/**
 * State DTO
 * Data Transfer Object for State entity
 * Supports multilingual names with Ar, En, Fr suffixes
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
 * Get localized name for State based on current language
 * @param state - State object with multilingual names
 * @param language - Current language code ('ar', 'en', 'fr')
 * @returns Localized name or fallback to English
 */
export const getStateLocalizedName = (state: StateDTO, language: string): string => {
  if (!state) return '';
  
  const lang = language.toLowerCase();
  
  switch (lang) {
    case 'ar':
      return state.nameAr || state.nameEn || state.nameFr || '';
    case 'fr':
      return state.nameFr || state.nameEn || state.nameAr || '';
    case 'en':
    default:
      return state.nameEn || state.nameFr || state.nameAr || '';
  }
};
