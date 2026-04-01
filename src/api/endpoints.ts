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

// Mock data for development
const mockOperations: Operation[] = [
  { id: 1, cardId: 1, cardNumber: '**** 1234', type: 'CONSUMO', amount: 1500.00, date: '2024-01-15', description: 'Supermercado' },
  { id: 2, cardId: 1, cardNumber: '**** 1234', type: 'PAGO', amount: 2500.00, date: '2024-01-14', description: 'Pago mínimo' },
  { id: 3, cardId: 2, cardNumber: '**** 5678', type: 'CONSUMO', amount: 450.50, date: '2024-01-13', description: 'Restaurante' },
  { id: 4, cardId: 2, cardNumber: '**** 5678', type: 'CONSUMO', amount: 120.00, date: '2024-01-12', description: 'Gasolina' },
  { id: 5, cardId: 1, cardNumber: '**** 1234', type: 'PAGO', amount: 3000.00, date: '2024-01-10', description: 'Pago total' },
  { id: 6, cardId: 2, cardNumber: '**** 5678', type: 'CONSUMO', amount: 890.00, date: '2024-01-08', description: 'Electrónicos' },
]

export const operationsApi = {
  /**
   * GET /api/v1/operations
   * Fetch all operations with optional filters
   */
  getAll: async (filters?: OperationFilters): Promise<OperationListResponse> => {
    // Development: return mock data
    if (import.meta.env.DEV) {
      let filteredOps = [...mockOperations]
      
      if (filters?.cardId) {
        filteredOps = filteredOps.filter(op => op.cardId === filters.cardId)
      }
      if (filters?.type) {
        filteredOps = filteredOps.filter(op => op.type === filters.type)
      }
      
      const page = filters?.page || 1
      const limit = filters?.limit || 10
      const start = (page - 1) * limit
      const end = start + limit
      
      return {
        data: filteredOps.slice(start, end),
        total: filteredOps.length,
        page,
        limit,
        totalPages: Math.ceil(filteredOps.length / limit),
      }
    }
    
    // Production: call real API
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
    // Development: create mock operation
    if (import.meta.env.DEV) {
      const newOperation: Operation = {
        id: mockOperations.length + 1,
        cardId: data.cardId,
        cardNumber: `**** ${Math.floor(1000 + Math.random() * 9000)}`,
        type: data.type,
        amount: data.amount,
        date: new Date().toISOString().split('T')[0],
        description: data.description,
      }
      mockOperations.push(newOperation)
      return newOperation
    }
    
    // Production: call real API
    return apiClient.post<Operation>('/operations', data)
  },
}
