/**
 * Axios HTTP Client Configuration
 * Credit Card Service - Puerto 9000
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'
import { CREDIT_CARD_API } from '@/constants/api.config'
import { ApiError } from '@/types/common.types'

/**
 * Credit Card Service Client
 * Base URL: http://localhost:9000/api/v1
 */
class CreditCardClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: CREDIT_CARD_API.BASE_URL,
      timeout: CREDIT_CARD_API.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    this.setupInterceptors()
  }

  private setupInterceptors(): void {
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

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError<ApiError>) => {
        const { response } = error
        if (response?.status === 401) {
          window.location.href = '/login'
        }
        if (!response) {
          console.error('Network error - Credit Card Service')
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
      message: error.message || 'Error en servicio de tarjetas',
      status: error.response?.status || 500,
    }
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }

  public get instance(): AxiosInstance {
    return this.client
  }
}

// Export singleton instance
export const creditCardClient = new CreditCardClient()