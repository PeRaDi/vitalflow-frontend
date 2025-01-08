'use server';

import AuthService from "@/services/auth/authService";
import { SigninDto } from "@/services/auth/dtos/signin.dto";

export async function handleSignin(prevState: any, formData: FormData) : Promise<any> {
  const emailOrUsername = formData.get('emailOrUsername') as string;
  const password = formData.get('password') as string;

  try {
    if(!emailOrUsername || !password) 
        return { success: false, message: 'You must fill the required data.' };

    const signinDto: SigninDto = {
      emailOrUsername,
      password
    };
    const response = await AuthService.signin(signinDto);
    return { success: response.success, message: response.message, data: response.data };
  } catch {
    return { success: false, message: 'An unknown error occurred signing in.' };
  }
}