/**
 * useOperations Hook
 * Manejo de operaciones (CONSUMO/PAGO)
 * 
 * Usa:
 * - Operations Service (9093): getActive, createOperation
 * - Credit Card Service (9000): updateBalance
 */

import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { creditCardApi, OperationRequest, OperationResponse } from '@/api/endpoints'
import { CreditCard, OperationFormData, OperationFormErrors } from '@/types/credit-card.types'

interface UseOperationsReturn {
  // State
  activeCards: CreditCard[]
  isLoadingCards: boolean
  isProcessing: boolean
  error: Error | null
  
  // Form
  formData: OperationFormData
  formErrors: OperationFormErrors
  cardOptions: { label: string; value: number }[]
  
  // Handlers
  setFormField: (field: keyof OperationFormData, value: string | number | null) => void
  handleSubmit: () => Promise<OperationResponse | null>
  resetForm: () => void
}

const initialFormData: OperationFormData = {
  cardId: null,
  operation: 'CONSUMO',
  amount: '',
  description: '',
}

export function useOperations(): UseOperationsReturn {
  const queryClient = useQueryClient()
  
  // Fetch active cards from Operations Service (9093)
  const { data: activeCards = [], isLoading: isLoadingCards } = useQuery({
    queryKey: ['activeCards'],
    queryFn: () => creditCardApi.getActive(),
  })

  // Mutation for operations via Operations Service (9093)
  const operationMutation = useMutation({
    mutationFn: async (data: OperationRequest): Promise<OperationResponse> => {
      // Check if balance update or full operation
      try {
        return await creditCardApi.createOperation(data)
      } catch {
        // Fallback: use balance endpoint directly
        const card = activeCards.find(c => c.id === data.cardId)
        if (!card) throw new Error('Tarjeta no encontrada')
        
        await creditCardApi.updateBalance(data.cardId, {
          amount: data.amount,
          operation: data.operation,
        })
        
        return {
          cardId: data.cardId,
          previousBalance: card.availableBalance,
          newBalance: data.operation === 'CONSUMO' 
            ? card.availableBalance - data.amount 
            : card.availableBalance + data.amount,
          amount: data.amount,
          operation: data.operation,
          processedAt: new Date().toISOString(),
        }
      }
    },
    onSuccess: () => {
      // Invalidate active cards to refetch
      queryClient.invalidateQueries({ queryKey: ['activeCards'] })
    },
  })
  
  // Form state
  const [formData, setFormData] = useState<OperationFormData>(initialFormData)
  const [formErrors, setFormErrors] = useState<OperationFormErrors>({})

  // Card options for dropdown
  const cardOptions = useMemo(() => 
    activeCards.map((card: CreditCard) => ({
      label: `${card.cardNumber} - ${card.holderName}`,
      value: card.id,
    })),
    [activeCards]
  )

  // Validate form
  const validate = useCallback((): boolean => {
    const errors: OperationFormErrors = {}
    
    if (!formData.cardId) {
      errors.cardId = 'Selecciona una tarjeta'
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Ingresa un monto válido'
    }

    if (formData.operation === 'CONSUMO' && !formData.description.trim()) {
      errors.description = 'Ingresa una descripción'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }, [formData])

  // Set form field
  const setFormField = useCallback((field: keyof OperationFormData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field as keyof OperationFormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [formErrors])

  // Submit handler
  const handleSubmit = useCallback(async (): Promise<OperationResponse | null> => {
    if (!validate()) return null

    const result = await operationMutation.mutateAsync({
      cardId: formData.cardId!,
      amount: parseFloat(formData.amount),
      operation: formData.operation,
    })

    setFormData(initialFormData)
    setFormErrors({})
    return result
  }, [formData, validate, operationMutation])

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData)
    setFormErrors({})
  }, [])

  return {
    activeCards,
    isLoadingCards,
    isProcessing: operationMutation.isPending,
    error: operationMutation.error as Error | null,
    formData,
    formErrors,
    cardOptions,
    setFormField,
    handleSubmit,
    resetForm,
  }
}

export default useOperations