export interface ResetPasswordDto {
  emailOrUsername: string;
  forgotPasswordToken: string;
  password: string;
  confirmPassword: string;
}
