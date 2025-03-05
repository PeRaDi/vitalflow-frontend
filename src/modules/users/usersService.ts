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
      active: response.data.active,
    };
  } catch (error) {
    const errorMessage =
      (error as any).response?.data?.errorMessage ||
      "An unknown error occurred.";
    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function getUsers(): Promise<any> {
  try {
    const response = await api.get("/users", { withCredentials: true });
    if (response.status != 200)
      return { success: false, message: response.data.message };

    return {
      success: true,
      message: "Successfully retrieved users.",
      users: response.data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An unknown error occurred retrieving users.",
    };
  }
}
