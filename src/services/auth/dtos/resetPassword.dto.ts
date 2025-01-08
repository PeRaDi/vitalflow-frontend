export interface ResetPasswordDto {
    forgotPasswordToken: string;
    password: string;
    confirmPassword: string;
}