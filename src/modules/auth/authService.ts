import { Response } from "@/types/response";
import { Role } from "@/types/role";
import { Tenant } from "@/types/tenant";
import { User } from "@/types/user";
import api from "../api";
import { ChangePasswordDto } from "./dtos/changePassword.dto";
import { ForgotPasswordDto } from "./dtos/forgotPassword.dto";
import { ResetPasswordDto } from "./dtos/resetPassword.dto";
import { SigninDto } from "./dtos/signin.dto";
import { SignupDto } from "./dtos/signup.dto";

export async function handleSignin(signinDto: SigninDto): Promise<Response> {
  try {
    const responseSignin = await api.post("/auth/signin", signinDto, {
      withCredentials: true,
    });

    const responseInfo = await api.get("/users/info", {
      withCredentials: true,
    });

    if (responseSignin.status != 200 && responseInfo.status != 200)
      return {
        success: false,
        message: responseSignin.data.message || responseInfo.data.message,
        status: responseInfo.status,
      };

    const { data } = responseInfo.data;

    const tenant: Tenant = data.tenant;
    const role: Role = data.role;
    const user: User = {
      id: data.id,
      name: data.name,
      email: data.email,
      username: data.username,
      tenant,
      role,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      active: data.active,
    };

    return {
      success: responseInfo.status == 200,
      message: responseInfo.data.message,
      data: user,
      status: responseSignin.status,
    };
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message,
        status: error.status,
      };
    }
    //console.error(error);
    return {
      success: false,
      message: "An unknown error occurred signing in.",
      status: 500,
    };
  }
}

export async function handleVerifyToken(): Promise<Response> {
  try {
    const response = await api.get("/users/info", { withCredentials: true });

    if (response.status != 200)
      return {
        success: false,
        message: response.data.message,
        status: response.status,
      };

    return {
      success: true,
      message: "Token verified.",
      status: response.status,
    };
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message,
        status: error.response.status,
      };
    }
    console.error(error);
    return {
      success: false,
      message: "An unknown error occurred verifying token.",
      status: 500,
    };
  }
}

export async function handleSignup(signupDto: SignupDto): Promise<Response> {
  try {
    const response = await api.post("/auth/signup", signupDto);

    return {
      success: response.status == 200,
      message: response.data.message,
      status: response.status,
    };
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message,
        status: error.response.status,
      };
    }
    console.error(error);
    return {
      success: false,
      message: "An unknown error occurred signing up.",
      status: 500,
    };
  }
}

export async function handleSignout(): Promise<Response> {
  try {
    const response = await api.post("/auth/signout", { withCredentials: true });

    return {
      success: response.status == 200,
      message: response.data.message,
      status: response.status,
    };
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message,
        status: error.response.status,
      };
    }
    console.error(error);
    return {
      success: false,
      message: "An unknown error occurred signing out.",
      status: 500,
    };
  }
}

export async function handleForgotPassword(
  forgotPasswordDto: ForgotPasswordDto
): Promise<any> {
  try {
    const response = await api.post("/auth/forgot-password", forgotPasswordDto);
    console.log(response);
    return {
      success: response.status == 200,
      message: response.data.message,
      status: response.status,
    };
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message,
        status: error.response.status,
      };
    }
    console.error(error);
    return {
      success: false,
      message: "An unknown error occurred sending the password reset code.",
      status: 500,
    };
  }
}

export async function handleResetPassword(
  resetPasswordDto: ResetPasswordDto
): Promise<Response> {
  try {
    const response = await api.post("/auth/reset-password", resetPasswordDto);
    console.log(response.data.message);
    return {
      success: response.status == 200,
      message: response.data.message,
      status: response.status,
    };
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message,
        status: error.response.status,
      };
    }
    console.error(error);
    return {
      success: false,
      message: "An unknown error resetting the password.",
      status: 500,
    };
  }
}

export async function handleChangePassword(
  changePasswordDto: ChangePasswordDto
): Promise<Response> {
  try {
    const response = await api.post(
      "/auth/change-password",
      changePasswordDto,
      {
        withCredentials: true,
      }
    );

    return {
      success: true,
      message: response.data.message,
      status: response.status,
    };
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message,
        status: error.response.status,
      };
    }
    console.error(error);
    return {
      success: false,
      message: "An unknown error occurred changing password.",
      status: 500,
    };
  }
}
