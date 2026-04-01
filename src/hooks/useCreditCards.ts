/**
 * useCreditCards Hook
 * Custom hook for credit card list management
 * Handles: fetching, filtering, pagination, loading states
 * Internally uses React Query for data fetching
 */

import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { creditCardApi } from '@/api/endpoints'
import { CreditCard, CreditCardFilters } from '@/types/credit-card.types'
import { queryKeys } from './useQueries'

interface UseCreditCardsReturn {
  // State
  cards: CreditCard[]
  isLoading: boolean
  isFetching: boolean
  error: Error | null
  filters: CreditCardFilters
  
  // Pagination
  page: number
  totalPages: number
  total: number
  
  // Actions
  setFilters: (filters: Partial<CreditCardFilters>) => void
  setPage: (page: number) => void
  setStatusFilter: (status: string | undefined) => void
  setSearchFilter: (search: string) => void
  updateStatus: (id: number, status: 'ACTIVA' | 'BLOQUEADA') => Promise<void>
  
  // Helpers
  refetch: () => Promise<void>
  isEmpty: boolean
}

export function useCreditCards(): UseCreditCardsReturn {
  const queryClient = useQueryClient()
  
  // Filters state
  const [filters, setFiltersState] = useState<CreditCardFilters>({
    page: 1,
    limit: 10,
    status: undefined,
    search: '',
  })
  
  // Compute current page
  const page = filters.page ?? 1
  
  // Build query key with filters
  const queryKey = useMemo(
    () => queryKeys.creditCards.list(filters),
    [filters]
  )
  
  // React Query for fetching cards
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey,
    queryFn: () => creditCardApi.getAll(filters),
  })
  
  // Extract response data
  const cards = data?.data ?? []
  const totalPages = data?.totalPages ?? 0
  const total = data?.total ?? 0
  
  // Mutation for updating status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'ACTIVA' | 'BLOQUEADA' }) =>
      creditCardApi.updateStatus(id, status),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.creditCards.all })
    },
  })
  
  // Set filters - resets to page 1 on filter change
  const setFilters = useCallback((newFilters: Partial<CreditCardFilters>) => {
    setFiltersState((prev) => {
      const updated = { ...prev, ...newFilters }
      // Reset to page 1 if page-specific filters change
      if (newFilters.status !== undefined || newFilters.search !== undefined) {
        updated.page = 1
      }
      return updated
    })
  }, [])
  
  // Set page
  const setPage = useCallback((newPage: number) => {
    setFiltersState((prev) => ({ ...prev, page: newPage }))
  }, [])
  
  // Set status filter
  const setStatusFilter = useCallback((status: string | undefined) => {
    setFilters({ status: status as CreditCardFilters['status'] })
  }, [setFilters])
  
  // Set search filter
  const setSearchFilter = useCallback((search: string) => {
    setFilters({ search })
  }, [setFilters])
  
  // Update status
  const updateStatus = useCallback(async (id: number, status: 'ACTIVA' | 'BLOQUEADA') => {
    await updateStatusMutation.mutateAsync({ id, status })
  }, [updateStatusMutation])
  
  // Refetch
  const refetchCards = useCallback(async () => {
    await refetch()
  }, [refetch])
  
  return {
    // State
    cards,
    isLoading,
    isFetching,
    error: error as Error | null,
    filters,
    
    // Pagination
    page,
    totalPages,
    total,
    
    // Actions
    setFilters,
    setPage,
    setStatusFilter,
    setSearchFilter,
    updateStatus,
    
    // Helpers
    refetch: refetchCards,
    isEmpty: !isLoading && cards.length === 0,
  }
}

export default useCreditCards