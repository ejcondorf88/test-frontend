/**
 * Operations Domain Types
 * Types for credit card operations (consumption and payments)
 */

export type OperationType = 'CONSUMO' | 'PAGO'

export interface Operation {
  id: number
  cardId: number
  cardNumber: string
  type: OperationType
  amount: number
  date: string
  description: string
}

export interface OperationListResponse {
  data: Operation[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface OperationFilters {
  cardId?: number
  type?: OperationType
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface OperationCreateRequest {
  cardId: number
  type: OperationType
  amount: number
  description: string
}

export interface OperationFormData {
  cardId: number | null
  type: OperationType
  amount: string
  description: string
}

export interface OperationFormErrors {
  cardId?: string
  type?: string
  amount?: string
  description?: string
}

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
