/**
 * Query Keys and Hooks - Credit Card Service
 * Documentación: http://localhost:9000/api/v1/creditcards
 * 
 * Endpoints del servicio:
 * - GET    /creditcards          - Listar todas las tarjetas
 * - GET    /creditcards/{id}     - Obtener tarjeta por ID
 * - POST   /creditcards           - Crear tarjeta
 * - PATCH  /creditcards/{id}/status   - Actualizar estado
 * - PATCH  /creditcards/{id}/balance  - Operar saldo (CONSUMO/PAGO)
 * - DELETE /creditcards/{id}     - Eliminar tarjeta
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  creditCardApi, 
  OperationType 
} from '@/api/endpoints'
import { 
  CreditCardFilters, 
  CreditCardCreateRequest
} from '@/types/credit-card.types'

// ============================================================================
// Query Keys
// ============================================================================

export const queryKeys = {
  creditCards: {
    all: ['creditCards'] as const,
    list: (filters?: CreditCardFilters) => [...queryKeys.creditCards.all, 'list', filters] as const,
    detail: (id: number) => [...queryKeys.creditCards.all, 'detail', id] as const,
    active: () => [...queryKeys.creditCards.all, 'active'] as const,
  },
} as const

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * GET /creditcards - Obtiene todas las tarjetas de crédito
 */
export function useCreditCards(filters?: CreditCardFilters) {
  return useQuery({
    queryKey: queryKeys.creditCards.list(filters),
    queryFn: () => creditCardApi.getAll(filters),
  })
}

/**
 * GET /creditcards/{id} - Obtiene una tarjeta específica por su ID
 */
export function useCreditCardById(id: number) {
  return useQuery({
    queryKey: queryKeys.creditCards.detail(id),
    queryFn: () => creditCardApi.getById(id),
    enabled: !!id,
  })
}

/**
 * GET /credit-cards/active - Obtiene solo tarjetas activas (puerto 9092)
 */
export function useActiveCards() {
  return useQuery({
    queryKey: queryKeys.creditCards.active(),
    queryFn: () => creditCardApi.getActive(),
  })
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * POST /creditcards - Crea una nueva tarjeta de crédito
 */
export function useCreateCreditCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreditCardCreateRequest) => creditCardApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.creditCards.all })
    },
  })
}

/**
 * PATCH /creditcards/{id}/status - Actualiza el estado de una tarjeta
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
 * PATCH /creditcards/{id}/balance - Opera el saldo (CONSUMO o PAGO)
 * - CONSUMO: Resta del saldo disponible
 * - PAGO: Suma al saldo disponible
 */
export function useUpdateBalance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, amount, operation }: { id: number; amount: number; operation: OperationType }) =>
      creditCardApi.updateBalance(id, { amount, operation }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.creditCards.all })
    },
  })
}

/**
 * DELETE /creditcards/{id} - Elimina una tarjeta de crédito
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