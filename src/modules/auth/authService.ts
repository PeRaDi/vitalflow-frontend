import { Response } from "@/types/response";
import { apiClient } from "../apiClient";
import { SigninDto } from "./dtos/signin.dto";
import { SignupDto } from "./dtos/signup.dto";
import SigninResponse from "./responses/signin.response";
import SignupResponse from "./responses/signup.response";
import { ForgotPasswordDto } from "./dtos/forgotPassword.dto";
import { ResetPasswordDto } from "./dtos/resetPassword.dto";

export default class AuthService {
  static async signup(signupDto: SignupDto): Promise<Response<SignupResponse>> {
    return await apiClient.post<SignupResponse>("auth/signup", signupDto);
  }

  static async signin(signinDto: SigninDto): Promise<Response<SigninResponse>> {
    return await apiClient.post<SigninResponse>("auth/signin", signinDto);
  }

  static async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto
  ): Promise<Response<null>> {
    return await apiClient.post<null>("auth/forgotPassword", forgotPasswordDto);
  }

  static async resetPassword(
    resetPasswordDto: ResetPasswordDto
  ): Promise<Response<null>> {
    return await apiClient.post<null>("auth/resetPassword", resetPasswordDto);
  }
}
