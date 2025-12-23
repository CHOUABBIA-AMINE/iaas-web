/**
 * Localization Utilities for State and Locality
 * Helper functions to get localized names based on language
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 */

import { StateDTO, LocalityDTO } from '../dto';

/**
 * Get localized name from State or Locality based on current language
 * @param entity - State or Locality DTO
 * @param language - Current language code ('ar', 'en', 'fr')
 * @returns Localized name string
 */
export const getLocalizedName = (
  entity: StateDTO | LocalityDTO | null | undefined,
  language: string
): string => {
  if (!entity) return '';

  // Normalize language code
  const lang = language.toLowerCase().substring(0, 2);

  switch (lang) {
    case 'ar':
      return entity.nameAr || entity.nameEn || entity.nameFr || '';
    case 'fr':
      return entity.nameFr || entity.nameEn || entity.nameAr || '';
    case 'en':
    default:
      return entity.nameEn || entity.nameFr || entity.nameAr || '';
  }
};

/**
 * Sort array of States or Localities by localized name
 * @param items - Array of State or Locality DTOs
 * @param language - Current language code ('ar', 'en', 'fr')
 * @returns Sorted array
 */
export const sortByLocalizedName = <T extends StateDTO | LocalityDTO>(
  items: T[],
  language: string
): T[] => {
  return [...items].sort((a, b) => {
    const nameA = getLocalizedName(a, language);
    const nameB = getLocalizedName(b, language);
    return nameA.localeCompare(nameB);
  });
};
