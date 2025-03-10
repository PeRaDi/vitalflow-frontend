import { Role } from "@/types/role";
import { Tenant } from "@/types/tenant";
import { User } from "@/types/user";
import api from "../api";
import { ChangePasswordDto } from "./dtos/changePassword.dto";
import { SigninDto } from "./dtos/signin.dto";
import { SignupDto } from "./dtos/signup.dto";

export async function handleSignin(signinDto: SigninDto): Promise<any> {
  try {
    const responseSignin = await api.post("/auth/signin", signinDto, {
      withCredentials: true,
    });

    const responseInfo = await api.get("/users/info", {
      withCredentials: true,
    });

    if (responseInfo.status != 200)
      return { success: false, message: responseInfo.data.message };

    const tenant: Tenant = responseInfo.data.tenant;
    const role: Role = responseInfo.data.role;
    const user: User = {
      id: responseInfo.data.id,
      name: responseInfo.data.name,
      email: responseInfo.data.email,
      username: responseInfo.data.username,
      tenant,
      role,
      createdAt: responseInfo.data.createdAt,
      updatedAt: responseInfo.data.updatedAt,
    };

    return {
      success: true,
      message: "Successfully signed in with: " + user.name,
      user,
    };
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }

    console.error(error);
    return {
      success: false,
      message: "An unknown error occurred signing in.",
    };
  }
}

export async function handleVerifyToken(): Promise<any> {
  try {
    const response = await api.get("/users/info", { withCredentials: true });

    if (response.status != 200)
      return { success: false, message: "Invalid or expired token." };

    return { success: true, message: "Token verified." };
  } catch (error) {
    return {
      success: false,
      message: "An unknown error occurred verifying token.",
    };
  }
}

export async function handleSignup(signupDto: SignupDto): Promise<any> {
  try {
    const response = await api.post("/auth/signup", signupDto);

    if (response.status != 200)
      return { success: false, message: response.data.message };

    return { success: true, message: "Successfully signed up." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "An unknown error occurred signing up." };
  }
}

export async function handleSignout(): Promise<any> {
  try {
    const response = await api.post("/auth/signout", { withCredentials: true });

    if (response.status != 200)
      return { success: false, message: response.data.message };

    return { success: true, message: "Successfully signed out." };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An unknown error occurred signing out.",
    };
  }
}

export async function handleForgotPassword(
  emailOrUsername: string
): Promise<any> {
  try {
    const response = await api.post("/auth/forgot-password", {
      emailOrUsername,
    });

    if (response.status != 200)
      return { success: false, message: response.data.message };

    return { success: true, message: "Successfully sent email." };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An unknown error occurred sending email.",
    };
  }
}

export async function handleResetPassword(
  emailOrUsername: string,
  forgotPasswordToken: string,
  password: string,
  confirmPassword: string
): Promise<any> {
  try {
    const response = await api.post("/auth/reset-password", {
      emailOrUsername,
      forgotPasswordToken,
      password,
      confirmPassword,
    });

    if (response.status != 200)
      return { success: false, message: response.data.message };

    return { success: true, message: "Successfully reset password." };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An unknown error occurred resetting password.",
    };
  }
}

export async function handleChangePassword(
  changePasswordDto: ChangePasswordDto
): Promise<any> {
  try {
    const response = await api.post(
      "/auth/change-password",
      changePasswordDto,
      {
        withCredentials: true,
      }
    );

    return { success: true, message: response.data.message };
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.errorMessage,
      };
    }
    console.error(error);
    return {
      success: false,
      message: "An unknown error occurred changing password.",
    };
  }
}
