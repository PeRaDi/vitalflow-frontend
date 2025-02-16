import api from "../api";
import { CreateTenantDto } from "./dtos/tenant.dto";
import AddContactsDto from "./dtos/contact.dto";

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

export async function createTenant(tenant: CreateTenantDto): Promise<any> {
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
