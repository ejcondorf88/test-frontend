/**
 * CreditCard Domain Types
 * Corresponds to backend CreditCardResponseDTO
 */

export type CreditCardStatus = 'ACTIVA' | 'BLOQUEADA'

export interface CreditCard {
  id: number
  cardNumber: string
  holderName: string
  creditLimit: number
  availableBalance: number
  status: CreditCardStatus
  createdAt: string
  updatedAt: string
}

export interface CreditCardListResponse {
  data: CreditCard[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CreditCardFilters {
  status?: CreditCardStatus
  search?: string
  page?: number
  limit?: number
}

// DTO for creating a new credit card (matches backend)
export interface CreditCardCreateRequest {
  cardNumber: string
  holderName: string
  creditLimit: number
  availableBalance: number
  status: CreditCardStatus
}

// Form validation
export interface CreditCardFormData {
  cardNumber: string
  holderName: string
  creditLimit: string
  availableBalance: string
  status: CreditCardStatus
}

export interface CreditCardFormErrors {
  cardNumber?: string
  holderName?: string
  creditLimit?: string
  availableBalance?: string
  status?: string
}
