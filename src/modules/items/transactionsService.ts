import { Response } from "@/types/response";
import api from "../api";

export async function getStockedItemsOverview(): Promise<Response> {
  try {
    const response = await api.get("/items/transactions/overview", {
      withCredentials: true,
    });
    const { data } = response.data;
    return {
      success: response.status === 200,
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
      message: "An unknown error occurred retrieving stocked items.",
      status: 500,
    };
  }
}

export async function getItemStats(itemId: number): Promise<Response> {
  try {
    const response = await api.get(`/items/transactions/${itemId}/stats`, {
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
      message: "An unknown error occurred retreiving items.",
      status: 500,
    };
  }
}

export async function getItemHistory(itemId: number): Promise<Response> {
  try {
    const response = await api.get(`/items/transactions/${itemId}/history`, {
      params: { limit: 30 },
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
      message: "An unknown error occurred retreiving items.",
      status: 500,
    };
  }
}

export async function getItemUserLogs(
  itemId: number,
  params?: { cursor?: string; limit?: number }
): Promise<Response> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.cursor) {
      queryParams.append("cursor", params.cursor);
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    const url = `/items/transactions/${itemId}/user-logs${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await api.get(url, {
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
      message: "An unknown error occurred retreiving items.",
      status: 500,
    };
  }
}

export async function createTransaction(
  itemId: number,
  quantity: number,
  transactionType: number
): Promise<Response> {
  try {
    const response = await api.patch(
      `/items/transactions/${itemId}`,
      { quantity, transactionType },
      { withCredentials: true }
    );
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
      message: "An unknown error occurred creating transaction.",
      status: 500,
    };
  }
}
