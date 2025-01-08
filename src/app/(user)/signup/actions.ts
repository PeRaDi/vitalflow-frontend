'use server';

import AuthService from "@/services/auth/authService";
import { SignupDto } from "@/services/auth/dtos/signup.dto";

export async function handleSignUp(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string; 
  const confirmPassword = formData.get('confirmPassword') as string;

  try {
    if (!username || !email || !password || !confirmPassword)
      return { success: false, message: 'You must fill the required data.' };

    const validEmail = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/g);
    const validPassword = password.length >= 8 && password === confirmPassword;

    if (!validEmail || !validPassword)
      return { success: false, message: 'Invalid email or password.' };

    const signupDto: SignupDto = {
      username,
      email,
      password,
      confirmPassword
    };

    return await AuthService.signup(signupDto);
  } catch {
    return { success: false, message: 'An unknown error occurred signing up.' };
  }
}
