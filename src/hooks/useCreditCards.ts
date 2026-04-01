/**
 * useCreditCards Hook
 * Custom hook for credit card list management
 * Handles: fetching, filtering, pagination, loading states
 */

import { useState, useCallback, useEffect } from 'react'
import { creditCardApi } from '@/api/endpoints'
import { CreditCard, CreditCardFilters } from '@/types/credit-card.types'

interface UseCreditCardsReturn {
  // State
  cards: CreditCard[]
  isLoading: boolean
  error: string | null
  filters: CreditCardFilters
  
  // Pagination
  page: number
  totalPages: number
  total: number
  
  // Actions
  fetchCards: () => Promise<void>
  setFilters: (filters: Partial<CreditCardFilters>) => void
  setPage: (page: number) => void
  setStatusFilter: (status: string | undefined) => void
  setSearchFilter: (search: string) => void
  blockCard: (id: number) => Promise<void>
  activateCard: (id: number) => Promise<void>
  
  // Helpers
  refetch: () => Promise<void>
  isEmpty: boolean
}

export function useCreditCards(): UseCreditCardsReturn {
  // State
  const [cards, setCards] = useState<CreditCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFiltersState] = useState<CreditCardFilters>({
    page: 1,
    limit: 10,
    status: undefined,
    search: '',
  })
  
  // Pagination state
  const [page, setPageState] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)

  // Fetch cards
  const fetchCards = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await creditCardApi.getAll({
        ...filters,
        page,
      })
      
      // API returns CreditCardListResponse directly
      setCards(response.data ?? [])
      setTotalPages(response.totalPages ?? 0)
      setTotal(response.total ?? 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las tarjetas')
      setCards([])
      setTotalPages(0)
      setTotal(0)
    } finally {
      setIsLoading(false)
    }
  }, [filters, page])

  // Set filters
  const setFilters = useCallback((newFilters: Partial<CreditCardFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }))
    setPageState(1) // Reset to page 1 on filter change
  }, [])

  // Set page
  const setPage = useCallback((newPage: number) => {
    setPageState(newPage)
  }, [])

  // Set status filter
  const setStatusFilter = useCallback((status: string | undefined) => {
    setFilters({ status: status as CreditCardFilters['status'] })
  }, [setFilters])

  // Set search filter
  const setSearchFilter = useCallback((search: string) => {
    setFilters({ search })
  }, [setFilters])

  // Block card
  const blockCard = useCallback(async (id: number) => {
    try {
      await creditCardApi.block(id)
      await fetchCards() // Refetch after action
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al bloquear la tarjeta')
      throw err
    }
  }, [fetchCards])

  // Activate card
  const activateCard = useCallback(async (id: number) => {
    try {
      await creditCardApi.activate(id)
      await fetchCards() // Refetch after action
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al activar la tarjeta')
      throw err
    }
  }, [fetchCards])

  // Refetch
  const refetch = useCallback(async () => {
    await fetchCards()
  }, [fetchCards])

  // Initial fetch
  useEffect(() => {
    fetchCards()
  }, [fetchCards])

  return {
    // State
    cards,
    isLoading,
    error,
    filters,
    
    // Pagination
    page,
    totalPages,
    total,
    
    // Actions
    fetchCards,
    setFilters,
    setPage,
    setStatusFilter,
    setSearchFilter,
    blockCard,
    activateCard,
    
    // Helpers
    refetch,
    isEmpty: !isLoading && cards.length === 0,
  }
}

export default useCreditCards
