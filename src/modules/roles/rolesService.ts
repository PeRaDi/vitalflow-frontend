import api from "../api";

export async function getRoles(): Promise<any> {
  try {
    const response = await api.get("/roles/get", { withCredentials: true });

    if (response.status != 200)
      return { success: false, message: response.data.message };

    return {
      success: true,
      message: "Successfully retrieved roles.",
      roles: response.data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An unknown error occurred retrieving roles.",
    };
  }
}
