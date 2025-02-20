import api from "../api";

export async function toggleUser(userId: number): Promise<any> {
  try {
    const response = await api.patch(`/users/${userId}/toggle`, {
      withCredentials: true,
    });

    if (response.status != 200)
      return { success: false, message: response.data.message };

    return {
      success: true,
      message: "Successfully toggled user.",
      tenants: response.data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An unknown error occurred toggling user.",
    };
  }
}
