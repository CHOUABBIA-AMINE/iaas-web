/**
 * Reset Password Request DTO
 * Matches: dz.mdn.iaas.system.security.dto.ResetPasswordRequest.java
 * 
 * @author CHOUABBIA Amine
 * @created 12-22-2025
 */

export interface ResetPasswordRequest {
  username: string     // Required, 3-20 characters
  newPassword: string  // Required, min 6 characters
}
