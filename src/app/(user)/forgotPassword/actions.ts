'use server';

import AuthService from "@/services/auth/authService";
import { ForgotPasswordDto } from "@/services/auth/dtos/forgotPassword.dto";
import { ResetPasswordDto } from "@/services/auth/dtos/resetPassword.dto";

export async function handleForgotPassword(prevState: any, formData: FormData) : Promise<any> {
  const emailOrUsername = formData.get('emailOrUsername') as string;

  try {
    if(!emailOrUsername) 
        return { success: false, message: 'You must fill the required data.' };

    const forgotPasswordDto: ForgotPasswordDto = {
      emailOrUsername
    };
    const response = await AuthService.forgotPassword(forgotPasswordDto);
    return { success: response.success, message: response.message, data: response.data };
  } catch {
    return { success: false, message: 'An unknown error occurred during password reset.' };
  }
}

export async function handleResetPassword(prevState: any, formData: FormData) : Promise<any> {
  const forgotPasswordToken = formData.get('token') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  
  try {
    if(!forgotPasswordToken || !password || !confirmPassword) 
        return { success: false, message: 'You must fill the required data.' };

    const validPassword = password.length >= 8 && password === confirmPassword;

    if (!validPassword)
      return { success: false, message: 'Invalid email or password.' };

    const resetPasswordDto: ResetPasswordDto = {
      forgotPasswordToken,
      password,
      confirmPassword
    };
    const response = await AuthService.resetPassword(resetPasswordDto);
    return { success: response.success, message: response.message, data: response.data };
  } catch {
    return { success: false, message: 'An unknown error occurred during password reset.' };
  }
}
