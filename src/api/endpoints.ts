/**
 * CreditCard API
 * Endpoints for credit card management
 */

import { apiClient } from './client'
import { CreditCard, CreditCardListResponse, CreditCardFilters, CreditCardCreateRequest } from '@/types/credit-card.types'

// Mock data for development
let mockCards: CreditCard[] = [
  {
    id: 1,
    cardNumber: '4532015112830366',
    holderName: 'Juan Pérez',
    creditLimit: 5000,
    availableBalance: 3500,
    status: 'ACTIVA',
    createdAt: '2024-01-15T10:30:00',
    updatedAt: '2024-01-20T14:00:00',
  },
  {
    id: 2,
    cardNumber: '5425233430109903',
    holderName: 'María García',
    creditLimit: 10000,
    availableBalance: 2000,
    status: 'ACTIVA',
    createdAt: '2024-02-01T09:00:00',
    updatedAt: '2024-02-10T16:30:00',
  },
  {
    id: 3,
    cardNumber: '2221000010000015',
    holderName: 'Carlos López',
    creditLimit: 3000,
    availableBalance: 3000,
    status: 'BLOQUEADA',
    createdAt: '2023-12-05T11:20:00',
    updatedAt: '2024-01-25T08:15:00',
  },
  {
    id: 4,
    cardNumber: '4916338506082832',
    holderName: 'Ana Martínez',
    creditLimit: 7500,
    availableBalance: 500,
    status: 'ACTIVA',
    createdAt: '2024-01-20T13:45:00',
    updatedAt: '2024-02-15T10:00:00',
  },
  {
    id: 5,
    cardNumber: '4024007179537001',
    holderName: 'Pedro Sánchez',
    creditLimit: 15000,
    availableBalance: 12000,
    status: 'ACTIVA',
    createdAt: '2023-11-10T08:30:00',
    updatedAt: '2024-02-01T12:00:00',
  },
]

let nextId = 6

export const creditCardApi = {
  getAll: async (filters?: CreditCardFilters): Promise<CreditCardListResponse> => {
    // In development, return mock data
    if (import.meta.env.DEV) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let filteredCards = [...mockCards]
      
      // Apply status filter
      if (filters?.status) {
        filteredCards = filteredCards.filter(c => c.status === filters.status)
      }
      
      // Apply search filter
      if (filters?.search) {
        const search = filters.search.toLowerCase()
        filteredCards = filteredCards.filter(c => 
          c.holderName.toLowerCase().includes(search) ||
          c.cardNumber.includes(search)
        )
      }
      
      const page = filters?.page ?? 1
      const limit = filters?.limit ?? 10
      const start = (page - 1) * limit
      const paginatedCards = filteredCards.slice(start, start + limit)
      
      return {
        data: paginatedCards,
        total: filteredCards.length,
        page,
        limit,
        totalPages: Math.ceil(filteredCards.length / limit),
      }
    }
    
    // Production: call real API
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', String(filters.page))
    if (filters?.limit) params.append('limit', String(filters.limit))

    const queryString = params.toString()
    const url = queryString ? `/credit-cards?${queryString}` : '/credit-cards'

    return apiClient.get<CreditCardListResponse>(url)
  },

  getById: async (id: number): Promise<CreditCard> => {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const card = mockCards.find(c => c.id === id)
      if (!card) throw new Error('Tarjeta no encontrada')
      return card
    }
    return apiClient.get<CreditCard>(`/credit-cards/${id}`)
  },

  create: async (data: CreditCardCreateRequest): Promise<CreditCard> => {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const now = new Date().toISOString()
      const newCard: CreditCard = {
        id: nextId++,
        ...data,
        createdAt: now,
        updatedAt: now,
      }
      mockCards.unshift(newCard) // Add to beginning
      return newCard
    }
    return apiClient.post<CreditCard>('/credit-cards', data)
  },

  block: async (id: number): Promise<CreditCard> => {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const card = mockCards.find(c => c.id === id)
      if (card) {
        card.status = 'BLOQUEADA'
        card.updatedAt = new Date().toISOString()
      }
      return card!
    }
    return apiClient.patch<CreditCard>(`/credit-cards/${id}/block`, {})
  },

  activate: async (id: number): Promise<CreditCard> => {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const card = mockCards.find(c => c.id === id)
      if (card) {
        card.status = 'ACTIVA'
        card.updatedAt = new Date().toISOString()
      }
      return card!
    }
    return apiClient.patch<CreditCard>(`/credit-cards/${id}/activate`, {})
  },

  // Update status (new unified endpoint)
  updateStatus: async (id: number, status: 'ACTIVA' | 'BLOQUEADA'): Promise<CreditCard> => {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const card = mockCards.find(c => c.id === id)
      if (card) {
        card.status = status
        card.updatedAt = new Date().toISOString()
      }
      return card!
    }
    return apiClient.patch<CreditCard>(`/credit-cards/${id}/status`, { status })
  },

  delete: async (id: number): Promise<void> => {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 300))
      mockCards = mockCards.filter(c => c.id !== id)
      return
    }
    return apiClient.delete<void>(`/credit-cards/${id}`)
  },
}
