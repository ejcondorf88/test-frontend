/**
 * Query Keys and Hooks
 * Centralized query keys and reusable React Query hooks
 * Provides type-safe query keys and typed query/mutation hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { creditCardApi, operationsApi } from '@/api/endpoints'
import { 
  CreditCardFilters, 
  CreditCardCreateRequest,
  OperationFilters, 
  OperationCreateRequest 
} from '@/types/credit-card.types'

// ============================================================================
// Query Keys
// ============================================================================

export const queryKeys = {
  // Credit Card Keys
  creditCards: {
    all: ['creditCards'] as const,
    list: (filters?: CreditCardFilters) => [...queryKeys.creditCards.all, 'list', filters] as const,
    detail: (id: number) => [...queryKeys.creditCards.all, 'detail', id] as const,
    active: () => [...queryKeys.creditCards.all, 'active'] as const,
  },
  // Operation Keys
  operations: {
    all: ['operations'] as const,
    list: (filters?: OperationFilters) => [...queryKeys.operations.all, 'list', filters] as const,
    byCard: (cardId: number) => [...queryKeys.operations.all, 'byCard', cardId] as const,
  },
} as const

// ============================================================================
// Credit Card Hooks
// ============================================================================

/**
 * Hook to fetch all credit cards with filters
 */
export function useCreditCards(filters?: CreditCardFilters) {
  return useQuery({
    queryKey: queryKeys.creditCards.list(filters),
    queryFn: () => creditCardApi.getAll(filters),
  })
}

/**
 * Hook to fetch a single credit card by ID
 */
export function useCreditCardById(id: number) {
  return useQuery({
    queryKey: queryKeys.creditCards.detail(id),
    queryFn: () => creditCardApi.getById(id),
    enabled: !!id, // Only fetch if id is provided
  })
}

/**
 * Hook to fetch active credit cards
 */
export function useActiveCards(limit: number = 100) {
  return useQuery({
    queryKey: queryKeys.creditCards.active(),
    queryFn: () => creditCardApi.getAll({ status: 'ACTIVA', limit }),
  })
}

/**
 * Hook to create a new credit card
 * Includes cache invalidation
 */
export function useCreateCreditCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreditCardCreateRequest) => creditCardApi.create(data),
    onSuccess: () => {
      // Invalidate credit cards list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.creditCards.all })
    },
  })
}

/**
 * Hook to update credit card status
 * Includes cache invalidation
 */
export function useUpdateCreditCardStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'ACTIVA' | 'BLOQUEADA' }) =>
      creditCardApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.creditCards.all })
    },
  })
}

/**
 * Hook to delete a credit card
 * Includes cache invalidation
 */
export function useDeleteCreditCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => creditCardApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.creditCards.all })
    },
  })
}

// ============================================================================
// Operation Hooks
// ============================================================================

/**
 * Hook to fetch all operations with filters
 */
export function useOperations(filters?: OperationFilters) {
  return useQuery({
    queryKey: queryKeys.operations.list(filters),
    queryFn: () => operationsApi.getAll(filters),
  })
}

/**
 * Hook to create a new operation
 * Includes cache invalidation
 */
export function useCreateOperation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: OperationCreateRequest) => operationsApi.create(data),
    onSuccess: () => {
      // Invalidate operations list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.operations.all })
    },
  })
}