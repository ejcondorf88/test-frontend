/**
 * Axios HTTP Client Configuration
 * Centralized axios instance with interceptors
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'
import { API_CONFIG } from '@/constants/api.config'
import { ApiError } from '@/types/common.types'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError<ApiError>) => {
        const { response, config } = error

        // Handle 401 - Token expired
        if (response?.status === 401 && config) {
          console.error('Token expired, redirecting to login...')
          window.location.href = '/login'
        }

        // Handle network errors
        if (!response) {
          console.error('Network error - please check your connection')
        }

        return Promise.reject(this.handleError(error))
      }
    )
  }

  private handleError(error: AxiosError<ApiError>): ApiError {
    if (error.response?.data) {
      return error.response.data
    }

    return {
      message: error.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
    }
  }

  // HTTP Methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  public async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  public async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  public async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }

  // Get raw axios instance for advanced use cases
  public get instance(): AxiosInstance {
    return this.client
  }
}

export const apiClient = new ApiClient()
