import { Response } from "@/types/response";
import api from "../api";

export async function toggleUser(userId: number): Promise<Response> {
  try {
    const response = await api.patch(`/users/${userId}/toggle`, {
      withCredentials: true,
    });
    const { data } = response.data;

    return {
      success: response.status == 200,
      message: response.data.message,
      data,
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
      message: "An unknown error occurred retreiving roles.",
      status: 500,
    };
  }
}

export async function getUsers(): Promise<Response> {
  try {
    const response = await api.get("/users", { withCredentials: true });
    const { data } = response.data;

    return {
      success: response.status == 200,
      message: response.data.message,
      data,
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
      message: "An unknown error occurred retreiving roles.",
      status: 500,
    };
  }
}
