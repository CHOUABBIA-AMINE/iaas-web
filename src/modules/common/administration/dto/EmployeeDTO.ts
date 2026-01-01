/**
 * Employee DTO
 * @author CHOUABBIA Amine
 * @created 12-30-2025
 * @updated 01-01-2026 - Add f_01 (Person field)
 */

export interface EmployeeDTO {
  id?: number;

  // Person fields
  f_01?: string;

  // Names
  lastNameAr: string;
  firstNameAr: string;
  lastNameLt: string;
  firstNameLt: string;

  birthDate?: string;
  birthPlace?: string;

  countryId?: number;
  registrationNumber?: string;

  jobId?: number;
  structureId?: number;
  militaryRankId?: number;
}
