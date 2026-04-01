/**
 * useCreditCardList Hook
 * Custom hook that combines data fetching logic with UI state for the CreditCardList component
 * Handles: credit card data fetching, search state, filter handlers, pagination, status management
 */

import { useState, useCallback } from 'react'
import { useCreditCards } from './useCreditCards'

// Status options for dropdown
export const statusOptions = [
  { label: 'Todos', value: undefined },
  { label: 'Activas', value: 'ACTIVA' },
  { label: 'Bloqueadas', value: 'BLOQUEADA' },
]

export interface UseCreditCardListProps {
  onViewCard?: (id: number) => void
}

interface UseCreditCardListReturn {
  // Data from useCreditCards
  cards: ReturnType<typeof useCreditCards>['cards']
  isLoading: ReturnType<typeof useCreditCards>['isLoading']
  error: ReturnType<typeof useCreditCards>['error']
  totalPages: ReturnType<typeof useCreditCards>['totalPages']
  total: ReturnType<typeof useCreditCards>['total']
  isEmpty: ReturnType<typeof useCreditCards>['isEmpty']
  
  // UI State
  searchValue: string
  
  // Handlers
  handleSearch: () => void
  handleSearchKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void
  handleStatusChange: (id: number, status: 'ACTIVA' | 'BLOQUEADA') => Promise<void>
  setSearchValue: (value: string) => void
  
  // Pagination
  page: number
  setPage: ReturnType<typeof useCreditCards>['setPage']
  
  // Re-exported for convenience
  setStatusFilter: ReturnType<typeof useCreditCards>['setStatusFilter']
  refetch: ReturnType<typeof useCreditCards>['refetch']
}

export function useCreditCardList(): UseCreditCardListReturn {
  // Data fetching logic
  const {
    cards,
    isLoading,
    error,
    page,
    totalPages,
    total,
    setPage,
    setStatusFilter,
    setSearchFilter,
    updateStatus,
    refetch,
    isEmpty,
  } = useCreditCards()

  // UI State - search input
  const [searchValue, setSearchValue] = useState('')

  // Handle search submit
  const handleSearch = useCallback(() => {
    setSearchFilter(searchValue)
  }, [searchValue, setSearchFilter])

  // Handle search key press
  const handleSearchKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }, [handleSearch])

  // Handle status change
  const handleStatusChange = useCallback(async (id: number, status: 'ACTIVA' | 'BLOQUEADA') => {
    await updateStatus(id, status)
  }, [updateStatus])

  return {
    // Data from useCreditCards
    cards,
    isLoading,
    error,
    totalPages,
    total,
    isEmpty,
    
    // UI State
    searchValue,
    
    // Handlers
    handleSearch,
    handleSearchKeyPress,
    handleStatusChange,
    setSearchValue,
    
    // Pagination
    page,
    setPage,
    
    // Re-exported
    setStatusFilter,
    refetch,
  }
}

export default useCreditCardList