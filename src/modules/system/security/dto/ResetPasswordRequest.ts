export interface ResetPasswordRequest {
  userId: number;
  newPassword: string;
  confirmPassword: string;
}
