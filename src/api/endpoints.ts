/**
 * CreditCard API
 * Endpoints for credit card management
 * Connects to Spring Boot backend at http://localhost:8080/api/v1
 */

import { apiClient } from './client'
import { CreditCard, CreditCardListResponse, CreditCardFilters, CreditCardCreateRequest } from '@/types/credit-card.types'
import { Operation, OperationListResponse, OperationFilters, OperationCreateRequest } from '@/types/credit-card.types'

export const creditCardApi = {
  /**
   * GET /api/v1/credit-cards
   * Fetch all credit cards with optional filters
   */
  getAll: async (filters?: CreditCardFilters): Promise<CreditCardListResponse> => {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', String(filters.page))
    if (filters?.limit) params.append('limit', String(filters.limit))

    const queryString = params.toString()
    const url = queryString ? `/credit-cards?${queryString}` : '/credit-cards'

    return apiClient.get<CreditCardListResponse>(url)
  },

  /**
   * GET /api/v1/credit-cards/{id}
   * Fetch a single credit card by ID
   */
  getById: async (id: number): Promise<CreditCard> => {
    return apiClient.get<CreditCard>(`/credit-cards/${id}`)
  },

  /**
   * POST /api/v1/credit-cards
   * Create a new credit card
   * Body: { cardNumber, holderName, creditLimit, availableBalance, status }
   */
  create: async (data: CreditCardCreateRequest): Promise<CreditCard> => {
    return apiClient.post<CreditCard>('/credit-cards', data)
  },

  /**
   * PATCH /api/v1/credit-cards/{id}/status
   * Update credit card status
   * Body: { status: 'ACTIVA' | 'BLOQUEADA' }
   */
  updateStatus: async (id: number, status: 'ACTIVA' | 'BLOQUEADA'): Promise<CreditCard> => {
    return apiClient.patch<CreditCard>(`/credit-cards/${id}/status`, { status })
  },

  /**
   * DELETE /api/v1/credit-cards/{id}
   * Delete a credit card
   */
  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/credit-cards/${id}`)
  },
}

export const operationsApi = {
  /**
   * GET /api/v1/operations
   * Fetch all operations with optional filters
   */
  getAll: async (filters?: OperationFilters): Promise<OperationListResponse> => {
    const params = new URLSearchParams()
    if (filters?.cardId) params.append('cardId', String(filters.cardId))
    if (filters?.type) params.append('type', filters.type)
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)
    if (filters?.page) params.append('page', String(filters.page))
    if (filters?.limit) params.append('limit', String(filters.limit))

    const queryString = params.toString()
    const url = queryString ? `/operations?${queryString}` : '/operations'

    return apiClient.get<OperationListResponse>(url)
  },

  /**
   * POST /api/v1/operations
   * Create a new operation
   * Body: { cardId, type, amount, description }
   */
  create: async (data: OperationCreateRequest): Promise<Operation> => {
    return apiClient.post<Operation>('/operations', data)
  },
}
