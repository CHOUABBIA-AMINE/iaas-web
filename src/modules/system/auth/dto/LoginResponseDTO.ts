/**
 * Login Response DTO
 * Matches backend: dz.mdn.iaas.system.auth.dto.LoginResponseDTO
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 */

export interface LoginResponseDTO {
  token: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
  };
}
