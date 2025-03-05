import api from "../api";
import { CreateTenantDto } from "./dtos/tenant.dto";
import AddContactsDto from "./dtos/contact.dto";
import { Tenant } from "@/types/tenant";

export async function getTenants(): Promise<any> {
  try {
    const response = await api.get("/tenants/get", { withCredentials: true });

    if (response.status != 200)
      return { success: false, message: response.data.message };

    return {
      success: true,
      message: "Successfully retrieved tenants.",
      tenants: response.data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An unknown error occurred retrieving tenants.",
    };
  }
}

export async function create(tenant: CreateTenantDto): Promise<any> {
  try {
    const response = await api.post("/tenants/create", tenant, {
      withCredentials: true,
    });

    if (response.status != 201)
      return { success: false, message: response.data.message };

    return {
      success: true,
      message: "Successfully created tenant.",
      tenant: response.data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An unknown error occurred creating tenant.",
    };
  }
}

export async function addContacts(
  tenantId: number,
  contacts: AddContactsDto
): Promise<any> {
  try {
    const response = await api.post(`/tenants/${tenantId}/contacts`, contacts, {
      withCredentials: true,
    });

    if (response.status != 201)
      return { success: false, message: response.data.message };

    return {
      success: true,
      message: "Successfully added contacts.",
      contacts: response.data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An unknown error occurred adding contacts.",
    };
  }
}

export async function toggle(tenantId: number): Promise<any> {
  try {
    const response = await api.patch(`/tenants/${tenantId}/toggle`, {
      withCredentials: true,
    });

    if (response.status != 200)
      return {
        success: false,
        message: response.data.message,
      };

    return {
      success: true,
      message: "Successfully toggled tenant.",
      active: response.data.active,
    };
  } catch (error) {
    return {
      success: false,
      message: "An unknown error occurred toggling tenant.",
    };
  }
}

export async function update(tenant: Tenant): Promise<any> {
  try {
    const updateResponse = await api.patch(`/tenants/${tenant.id}`, tenant, {
      withCredentials: true,
    });

    if (updateResponse.status != 200)
      return { success: false, message: updateResponse.data.message };

    const toggleResponse = await toggle(tenant.id);

    if (!toggleResponse.success)
      return {
        success: false,
        message: "An error occurred toggling tenant.",
      };

    return {
      success: true,
      message: "Successfully updated tenant.",
      tenant: updateResponse.data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An unknown error occurred updating tenant.",
    };
  }
}

export async function getUsers(tenantId: number): Promise<any> {
  try {
    const response = await api.get(`/tenants/${tenantId}/users`, {
      withCredentials: true,
    });

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

export async function getInvitedUsers(tenantId: number): Promise<any> {
  try {
    const response = await api.get(`/tenants/${tenantId}/invites`, {
      withCredentials: true,
    });

    if (response.status != 200)
      return { success: false, message: response.data.message };

    return {
      success: true,
      message: "Successfully retrieved invited users.",
      invitedUsers: response.data,
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
