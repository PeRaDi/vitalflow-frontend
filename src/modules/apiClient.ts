import { Response } from "@/types/response";

interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
  requiresAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.API_URL!;
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<Response<T>> {
    try {
      const { params, requiresAuth = false, ...requestConfig } = config;

      const url = new URL(endpoint, this.baseUrl);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      const headers = new Headers(requestConfig.headers);
      headers.set('Content-Type', 'application/json');

      if (requiresAuth) {
        const token = localStorage.getItem('token');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }

      const response = await fetch(url.toString(), {
        ...requestConfig,
        headers
      });

      let data = null;
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = await response.json();
      }

      return {
        data: data.data || null,
        message: data.message || null,
        status: response.status,
        success: response.ok
      };
    } catch (error) {
      return {
        data: null,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: 500,
        success: false
      };
    }
  }

  async get<T>(endpoint: string, config?: RequestConfig) {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async patch<T>(endpoint: string, data?: any, config?: RequestConfig) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig) {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

export default ApiClient;