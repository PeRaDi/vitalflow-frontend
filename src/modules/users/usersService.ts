import api from "../api";

export async function toggleUser(userId: number): Promise<any> {
  try {
    const response = await api.patch(`/users/${userId}/toggle`, {
      withCredentials: true,
    });

    console.log(response);

    if (response.status != 200)
      return { success: false, message: response.data.message };

    return {
      success: true,
      message: "Successfully toggled user.",
      active: response.data.active,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An unknown error occurred toggling user.",
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
