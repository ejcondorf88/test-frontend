/**
 * API Endpoints
 * 
 * Credit Card Service (Puerto 9000):
 * - GET    /api/v1/creditcards          - Listar todas las tarjetas
 * - GET    /api/v1/creditcards/{id}     - Obtener tarjeta por ID
 * - POST   /api/v1/creditcards           - Crear tarjeta
 * - PATCH  /api/v1/creditcards/{id}/status   - Actualizar estado
 * - PATCH  /api/v1/creditcards/{id}/balance  - Operar saldo
 * 
 * Operations Service (Puerto 9093):
 * - GET    /api/v1/credit-cards/active  - Listar tarjetas activas
 * - POST   /api/v1/operations             - Procesar operación
 */

import axios from 'axios'
import { CreditCard, CreditCardFilters, CreditCardCreateRequest } from '@/types/credit-card.types'

// Tipos para operaciones
export type OperationType = 'CONSUMO' | 'PAGO'

export interface UpdateBalanceRequest {
  amount: number
  operation: OperationType
}

export interface OperationRequest {
  cardId: number
  amount: number
  operation: OperationType
}

export interface OperationResponse {
  cardId: number
  previousBalance: number
  newBalance: number
  amount: number
  operation: OperationType
  processedAt: string
}

// Cliente Credit Card Service (puerto 9000)
const creditCardClient = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Cliente Operations Service (puerto 9093)
const operationsClient = axios.create({
  baseURL: '/operations-api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

export const creditCardApi = {
  // =====================
  // Credit Card Service (9000)
  // =====================

  /**
   * GET /api/v1/creditcards
   */
  getAll: async (filters?: CreditCardFilters): Promise<CreditCard[]> => {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', String(filters.page))
    if (filters?.limit) params.append('limit', String(filters.limit))

    const queryString = params.toString()
    const url = queryString ? `/creditcards?${queryString}` : '/creditcards'

    const response = await creditCardClient.get<CreditCard[]>(url)
    return response.data
  },

  /**
   * GET /api/v1/creditcards/{id}
   */
  getById: async (id: number): Promise<CreditCard> => {
    const response = await creditCardClient.get<CreditCard>(`/creditcards/${id}`)
    return response.data
  },

  /**
   * POST /api/v1/creditcards
   */
  create: async (data: CreditCardCreateRequest): Promise<CreditCard> => {
    const response = await creditCardClient.post<CreditCard>('/creditcards', data)
    return response.data
  },

  /**
   * PATCH /api/v1/creditcards/{id}/status
   */
  updateStatus: async (id: number, status: 'ACTIVA' | 'BLOQUEADA'): Promise<CreditCard> => {
    const response = await creditCardClient.patch<CreditCard>(`/creditcards/${id}/status`, { status })
    return response.data
  },

  /**
   * PATCH /api/v1/creditcards/{id}/balance
   */
  updateBalance: async (id: number, data: UpdateBalanceRequest): Promise<CreditCard> => {
    const response = await creditCardClient.patch<CreditCard>(`/creditcards/${id}/balance`, data)
    return response.data
  },

  /**
   * DELETE /api/v1/creditcards/{id}
   */
  delete: async (id: number): Promise<void> => {
    await creditCardClient.delete(`/creditcards/${id}`)
  },

  // =====================
  // Operations Service (9093)
  // =====================

  /**
   * GET /api/v1/credit-cards/active
   */
  getActive: async (): Promise<CreditCard[]> => {
    const response = await operationsClient.get<CreditCard[]>('/credit-cards/active')
    return response.data
  },

  /**
   * POST /api/v1/operations
   */
  createOperation: async (data: OperationRequest): Promise<OperationResponse> => {
    const response = await operationsClient.post<OperationResponse>('/operations', data)
    return response.data
  },
}