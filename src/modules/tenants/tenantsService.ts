import { Response } from "@/types/response";
import { Tenant } from "@/types/tenant";
import api from "../api";
import AddContactsDto from "./dtos/contact.dto";
import { CreateTenantDto } from "./dtos/tenant.dto";

export async function getTenants(): Promise<Response> {
  try {
    const response = await api.get("/tenants/get", { withCredentials: true });
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

export async function create(tenant: CreateTenantDto): Promise<Response> {
  try {
    const response = await api.post("/tenants/create", tenant, {
      withCredentials: true,
    });
    const { data } = response.data;

    return {
      success: response.status == 201,
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

export async function addContacts(
  tenantId: number,
  contacts: AddContactsDto
): Promise<any> {
  try {
    const response = await api.post(`/tenants/${tenantId}/contacts`, contacts, {
      withCredentials: true,
    });
    const { data } = response.data;

    return {
      success: response.status == 201,
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

export async function toggle(tenantId: number): Promise<Response> {
  try {
    const response = await api.patch(`/tenants/${tenantId}/toggle`, {
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

export async function update(tenant: Tenant): Promise<Response> {
  try {
    const updateResponse = await api.patch(`/tenants/${tenant.id}`, tenant, {
      withCredentials: true,
    });
    const { data } = updateResponse.data;

    return {
      success: updateResponse.status == 200,
      message: updateResponse.data.message,
      data,
      status: updateResponse.status,
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

export async function getTenantUsers(tenantId: number): Promise<Response> {
  try {
    const response = await api.get(`/tenants/${tenantId}/users`, {
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
