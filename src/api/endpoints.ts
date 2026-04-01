/**
 * API Endpoints - Credit Card Service
 * 
 * Puerto 9000 - Credit Card Service (tarjetas):
 * - GET    /api/v1/credit-cards     - Listar todas las tarjetas
 * - GET    /api/v1/credit-cards/{id} - Obtener tarjeta por ID
 * - POST   /api/v1/credit-cards      - Crear tarjeta
 * - PATCH  /api/v1/credit-cards/{id}/status   - Actualizar estado
 * - PATCH  /api/v1/credit-cards/{id}/balance  - Operar saldo
 * 
 * Puerto 9092 - Credit Card Service (operaciones):
 * - GET    /api/v1/credit-cards/active - Listar tarjetas activas
 */

import axios from 'axios'
import { CreditCard, CreditCardFilters, CreditCardCreateRequest } from '@/types/credit-card.types'

// Tipos para operaciones de balance
export type OperationType = 'CONSUMO' | 'PAGO'

export interface UpdateBalanceRequest {
  amount: number
  operation: OperationType
}

// Cliente principal (puerto 9000) - usa proxy /api
const mainClient = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Cliente para operaciones (puerto 9092) - usa proxy /operations-api
const operationsClient = axios.create({
  baseURL: '/operations-api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

export const creditCardApi = {
  /**
   * GET /credit-cards - Todas las tarjetas (puerto 9000)
   */
  getAll: async (filters?: CreditCardFilters): Promise<CreditCard[]> => {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', String(filters.page))
    if (filters?.limit) params.append('limit', String(filters.limit))

    const queryString = params.toString()
    const url = queryString ? `/credit-cards?${queryString}` : '/credit-cards'

    const response = await mainClient.get<CreditCard[]>(url)
    return response.data
  },

  /**
   * GET /credit-cards/active - Tarjetas activas (puerto 9092)
   */
  getActive: async (): Promise<CreditCard[]> => {
    const response = await operationsClient.get<CreditCard[]>('/credit-cards/active')
    return response.data
  },

  /**
   * GET /credit-cards/{id} (puerto 9000)
   */
  getById: async (id: number): Promise<CreditCard> => {
    const response = await mainClient.get<CreditCard>(`/credit-cards/${id}`)
    return response.data
  },

  /**
   * POST /credit-cards (puerto 9000)
   */
  create: async (data: CreditCardCreateRequest): Promise<CreditCard> => {
    const response = await mainClient.post<CreditCard>('/credit-cards', data)
    return response.data
  },

  /**
   * PATCH /credit-cards/{id}/status (puerto 9000)
   */
  updateStatus: async (id: number, status: 'ACTIVA' | 'BLOQUEADA'): Promise<CreditCard> => {
    const response = await mainClient.patch<CreditCard>(`/credit-cards/${id}/status`, { status })
    return response.data
  },

  /**
   * PATCH /credit-cards/{id}/balance (puerto 9000)
   */
  updateBalance: async (id: number, data: UpdateBalanceRequest): Promise<CreditCard> => {
    const response = await mainClient.patch<CreditCard>(`/credit-cards/${id}/balance`, data)
    return response.data
  },

  /**
   * DELETE /credit-cards/{id} (puerto 9000)
   */
  delete: async (id: number): Promise<void> => {
    await mainClient.delete(`/credit-cards/${id}`)
  },
}