import api from "../api";
import { SigninDto } from "./dtos/signin.dto";
import { Tenant } from "@/types/tenant";
import { Role } from "@/types/role";
import { User } from "@/types/user";
import { SignupDto } from "./dtos/signup.dto";

export async function handleSignin(signinDto: SigninDto): Promise<any> {
  try {
    const responseSignin = await api.post("/auth/signin", signinDto, {
      withCredentials: true,
    });

    if (responseSignin.status != 200)
      return { success: false, message: responseSignin.data.message };

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
  } catch (error) {
    console.error(error);
    return { success: false, message: "An unknown error occurred signing in." };
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
