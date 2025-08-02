import { CriticalityLevel } from "@/types/enums";
import { Item } from "@/types/item";
import { Response } from "@/types/response";
import api from "../api";

export async function getItems(): Promise<Response> {
  try {
    const response = await api.get("/items", { withCredentials: true });
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
      message: "An unknown error occurred retreiving items.",
      status: 500,
    };
  }
}

export async function createItem(
  name: string,
  description: string,
  criticality: CriticalityLevel,
  leadTime: number,
  frequentOrder: boolean
): Promise<Response> {
  try {
    const response = await api.post(
      "/items",
      { name, description, criticality, leadTime, frequentOrder },
      { withCredentials: true }
    );

    return {
      success: response.status == 201,
      message: response.data.message,
      data: response.data.data,
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
      message: "An unknown error occurred creating item.",
      status: 500,
    };
  }
}

export async function updateItem(item: Item): Promise<Response> {
  try {
    const response = await api.put(
      `/items/${item.id}`,
      { ...item },
      { withCredentials: true }
    );

    console.log(response);
    return {
      success: response.status == 200,
      message: response.data.message,
      data: response.data.data,
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
      message: "An unknown error occurred updating item.",
      status: 500,
    };
  }
}

export async function toggleItem(itemId: number): Promise<Response> {
  try {
    const response = await api.patch(`/items/${itemId}/toggle`, {
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
      message: "An unknown error occurred toggling item.",
      status: 500,
    };
  }
}
