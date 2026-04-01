/**
 * useOperations Hook
 * Custom hook for operations management
 * Handles: fetching operations, creating operations, active credit cards
 * Internally uses React Query for data fetching
 */

import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { operationsApi, creditCardApi } from '@/api/endpoints'
import { Operation, OperationFilters, OperationCreateRequest, CreditCard } from '@/types/credit-card.types'
import { queryKeys } from './useQueries'

interface UseOperationsReturn {
  // State
  operations: Operation[]
  activeCards: CreditCard[]
  isLoading: boolean
  isFetching: boolean
  isSubmitting: boolean
  error: Error | null
  filters: OperationFilters
  
  // Pagination
  page: number
  totalPages: number
  total: number
  
  // Actions
  setFilters: (filters: Partial<OperationFilters>) => void
  setPage: (page: number) => void
  createOperation: (data: OperationCreateRequest) => Promise<void>
  
  // Helpers
  refetch: () => Promise<void>
  isEmpty: boolean
  
  // Computed
  totalConsumption: number
  totalPayments: number
}

export function useOperations(): UseOperationsReturn {
  const queryClient = useQueryClient()
  
  // Filters state
  const [filters, setFiltersState] = useState<OperationFilters>({
    page: 1,
    limit: 10,
  })
  
  // Compute current page
  const page = filters.page ?? 1
  
  // Build query key with filters
  const operationsQueryKey = useMemo(
    () => queryKeys.operations.list(filters),
    [filters]
  )
  
  // React Query for fetching operations
  const { data: operationsData, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: operationsQueryKey,
    queryFn: () => operationsApi.getAll(filters),
  })
  
  // Extract operations data
  const operations = operationsData?.data ?? []
  const totalPages = operationsData?.totalPages ?? 0
  const total = operationsData?.total ?? 0
  
  // React Query for fetching active cards
  const { data: activeCardsData } = useQuery({
    queryKey: queryKeys.creditCards.active(),
    queryFn: () => creditCardApi.getAll({ status: 'ACTIVA', limit: 100 }),
  })
  
  const activeCards = activeCardsData?.data ?? []
  
  // Mutation for creating operations
  const createOperationMutation = useMutation({
    mutationFn: (data: OperationCreateRequest) => operationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.operations.all })
    },
  })
  
  // Set filters - resets to page 1 on filter change
  const setFilters = useCallback((newFilters: Partial<OperationFilters>) => {
    setFiltersState((prev) => {
      const updated = { ...prev, ...newFilters }
      if (newFilters.cardId !== undefined || newFilters.type !== undefined) {
        updated.page = 1
      }
      return updated
    })
  }, [])
  
  // Set page
  const setPage = useCallback((newPage: number) => {
    setFiltersState((prev) => ({ ...prev, page: newPage }))
  }, [])
  
  // Create operation
  const createOperation = useCallback(async (data: OperationCreateRequest) => {
    await createOperationMutation.mutateAsync(data)
  }, [createOperationMutation])
  
  // Refetch
  const refetchOperations = useCallback(async () => {
    await refetch()
  }, [refetch])
  
  // Computed values
  const totalConsumption = useMemo(
    () => operations.filter(op => op.type === 'CONSUMO').reduce((sum, op) => sum + op.amount, 0),
    [operations]
  )
  
  const totalPayments = useMemo(
    () => operations.filter(op => op.type === 'PAGO').reduce((sum, op) => sum + op.amount, 0),
    [operations]
  )
  
  return {
    // State
    operations,
    activeCards,
    isLoading,
    isFetching,
    isSubmitting: createOperationMutation.isPending,
    error: error as Error | null,
    filters,
    
    // Pagination
    page,
    totalPages,
    total,
    
    // Actions
    setFilters,
    setPage,
    createOperation,
    
    // Helpers
    refetch: refetchOperations,
    isEmpty: !isLoading && operations.length === 0,
    
    // Computed
    totalConsumption,
    totalPayments,
  }
}

export default useOperations