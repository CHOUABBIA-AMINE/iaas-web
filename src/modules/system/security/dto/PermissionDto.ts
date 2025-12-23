export interface PermissionDto {
  id?: number;
  code?: string;
  nameAr?: string;
  nameEn?: string;
  nameFr?: string;
  resource?: string;
  action?: string;
  authorityIds?: number[];
}
