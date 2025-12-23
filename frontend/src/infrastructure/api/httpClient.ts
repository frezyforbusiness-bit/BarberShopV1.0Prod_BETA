import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      },
    );
  }

  get<T>(url: string, config?: any) {
    return this.client.get<T>(url, config).then((res) => res.data);
  }

  post<T>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config).then((res) => res.data);
  }

  put<T>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config).then((res) => res.data);
  }

  delete<T>(url: string, config?: any) {
    return this.client.delete<T>(url, config).then((res) => res.data);
  }
}

export const httpClient = new HttpClient();

