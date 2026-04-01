/**
 * useOperations Hook
 * Custom hook for operations management
 * Handles: fetching operations, creating operations, active credit cards
 */

import { useState, useCallback, useEffect } from 'react'
import { operationsApi, creditCardApi } from '@/api/endpoints'
import { Operation, OperationFilters, OperationCreateRequest, CreditCard } from '@/types/credit-card.types'

interface UseOperationsReturn {
  // State
  operations: Operation[]
  activeCards: CreditCard[]
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
  filters: OperationFilters
  
  // Pagination
  page: number
  totalPages: number
  total: number
  
  // Actions
  fetchOperations: () => Promise<void>
  fetchActiveCards: () => Promise<void>
  createOperation: (data: OperationCreateRequest) => Promise<void>
  setFilters: (filters: Partial<OperationFilters>) => void
  setPage: (page: number) => void
  
  // Helpers
  refetch: () => Promise<void>
  isEmpty: boolean
  
  // Computed
  totalConsumption: number
  totalPayments: number
}

export function useOperations(): UseOperationsReturn {
  // State
  const [operations, setOperations] = useState<Operation[]>([])
  const [activeCards, setActiveCards] = useState<CreditCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFiltersState] = useState<OperationFilters>({
    page: 1,
    limit: 10,
  })
  
  // Pagination state
  const [page, setPageState] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)

  // Fetch operations
  const fetchOperations = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await operationsApi.getAll({
        ...filters,
        page,
      })
      
      setOperations(response.data ?? [])
      setTotalPages(response.totalPages ?? 0)
      setTotal(response.total ?? 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las operaciones')
      setOperations([])
      setTotalPages(0)
      setTotal(0)
    } finally {
      setIsLoading(false)
    }
  }, [filters, page])

  // Fetch active credit cards
  const fetchActiveCards = useCallback(async () => {
    try {
      const response = await creditCardApi.getAll({ status: 'ACTIVA', limit: 100 })
      setActiveCards(response.data ?? [])
    } catch (err) {
      console.error('Error fetching active cards:', err)
      setActiveCards([])
    }
  }, [])

  // Create operation
  const createOperation = useCallback(async (data: OperationCreateRequest) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      await operationsApi.create(data)
      await fetchOperations() // Refetch after creating
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la operación')
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }, [fetchOperations])

  // Set filters
  const setFilters = useCallback((newFilters: Partial<OperationFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }))
    setPageState(1) // Reset to page 1 on filter change
  }, [])

  // Set page
  const setPage = useCallback((newPage: number) => {
    setPageState(newPage)
  }, [])

  // Refetch
  const refetch = useCallback(async () => {
    await fetchOperations()
  }, [fetchOperations])

  // Computed values
  const totalConsumption = operations
    .filter(op => op.type === 'CONSUMO')
    .reduce((sum, op) => sum + op.amount, 0)

  const totalPayments = operations
    .filter(op => op.type === 'PAGO')
    .reduce((sum, op) => sum + op.amount, 0)

  // Initial fetch
  useEffect(() => {
    fetchOperations()
  }, [fetchOperations])

  // Fetch active cards on mount
  useEffect(() => {
    fetchActiveCards()
  }, [fetchActiveCards])

  return {
    // State
    operations,
    activeCards,
    isLoading,
    isSubmitting,
    error,
    filters,
    
    // Pagination
    page,
    totalPages,
    total,
    
    // Actions
    fetchOperations,
    fetchActiveCards,
    createOperation,
    setFilters,
    setPage,
    
    // Helpers
    refetch,
    isEmpty: !isLoading && operations.length === 0,
    
    // Computed
    totalConsumption,
    totalPayments,
  }
}

export default useOperations