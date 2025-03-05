import api from "../api";

export async function getInvitedUsers(tenantId?: number): Promise<any> {
  try {
    const response = await api.get("/tenants/invites", {
      withCredentials: true,
      params: { tenantId },
    });

    if (response.status != 200)
      return { success: false, message: response.data.message };

    return {
      success: true,
      message: "Successfully retrieved invited users.",
      users: response.data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An unknown error occurred retrieving invited users.",
    };
  }
}

export async function inviteUser(
  tenantId: number,
  email: string,
  roleId: number
): Promise<any> {
  try {
    const response = await api.post(
      `/tenants/${tenantId}/invite`,
      { email, roleId },
      {
        withCredentials: true,
      }
    );

    if (response.status != 200)
      return { success: false, message: response.data.message };

    return {
      success: true,
      message: "Successfully invited user.",
      invite: response.data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An unknown error occurred inviting user.",
    };
  }
}
