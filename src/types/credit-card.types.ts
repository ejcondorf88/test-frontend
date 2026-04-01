/**
 * CreditCard Types
 * Corresponds to Credit Card Service API
 * Base URL: http://localhost:9000/api/v1/creditcards
 */

// Status possible values
export type CreditCardStatus = 'ACTIVA' | 'BLOQUEADA'

// Operation types for balance updates
export type OperationType = 'CONSUMO' | 'PAGO'

// Credit Card entity
export interface CreditCard {
  id: number
  cardNumber: string      // Masked: "****3456"
  holderName: string
  creditLimit: number
  availableBalance: number
  status: CreditCardStatus
  createdAt: string      // ISO 8601
  updatedAt: string      // ISO 8601
}

// List response
export interface CreditCardListResponse {
  data: CreditCard[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Filters for list endpoint
export interface CreditCardFilters {
  status?: CreditCardStatus
  search?: string
  page?: number
  limit?: number
}

// Create request
export interface CreditCardCreateRequest {
  cardNumber: string      // Full number (13-19 digits)
  holderName: string
  creditLimit: number
  availableBalance: number
  status: CreditCardStatus
}

// Update balance request (CONSUMO/PAGO)
export interface UpdateBalanceRequest {
  amount: number          // Must be > 0
  operation: OperationType
}

// Form types
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

// Form for operations (CONSUMO/PAGO)
export interface OperationFormData {
  cardId: number | null
  operation: OperationType
  amount: string
  description: string
}

export interface OperationFormErrors {
  cardId?: string
  operation?: string
  amount?: string
  description?: string
}