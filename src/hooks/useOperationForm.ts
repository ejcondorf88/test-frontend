/**
 * useOperationForm Hook
 * Custom hook that combines form state, validation logic, and submission for operations
 * Handles: form data, validation, active card options, type options, submit handler
 */

import { useState, useCallback, useMemo } from 'react'
import { useOperations } from './useOperations'
import { OperationFormData, OperationFormErrors, OperationType, CreditCard } from '@/types/credit-card.types'

interface UseOperationFormReturn {
  // Form state
  formData: OperationFormData
  formErrors: OperationFormErrors
  
  // Options for dropdowns
  cardOptions: { label: string; value: number }[]
  typeOptions: { label: string; value: OperationType }[]
  
  // Form handlers
  handleCardChange: (value: number | null) => void
  handleTypeChange: (value: OperationType) => void
  handleAmountChange: (value: number | null) => void
  handleDescriptionChange: (value: string) => void
  handleSubmit: () => Promise<void>
  resetForm: () => void
  
  // State from useOperations
  isSubmitting: ReturnType<typeof useOperations>['isSubmitting']
  error: ReturnType<typeof useOperations>['error']
  
  // Computed values
  isFormValid: boolean
}

const initialFormData: OperationFormData = {
  cardId: null,
  type: 'CONSUMO',
  amount: '',
  description: '',
}

export function useOperationForm(): UseOperationFormReturn {
  // Get data fetching logic from useOperations
  const {
    activeCards,
    isSubmitting,
    error,
    createOperation,
  } = useOperations()

  // Form state
  const [formData, setFormData] = useState<OperationFormData>(initialFormData)
  const [formErrors, setFormErrors] = useState<OperationFormErrors>({})

  // Card options for dropdown - memoized
  const cardOptions = useMemo(() => 
    activeCards.map((card: CreditCard) => ({
      label: `${card.cardNumber} - ${card.holderName}`,
      value: card.id,
    })),
    [activeCards]
  )

  // Type options for dropdown
  const typeOptions = useMemo(() => [
    { label: 'Consumo', value: 'CONSUMO' as OperationType },
    { label: 'Pago', value: 'PAGO' as OperationType },
  ], [])

  // Validate form
  const validateForm = useCallback((): boolean => {
    const errors: OperationFormErrors = {}
    
    if (!formData.cardId) {
      errors.cardId = 'Selecciona una tarjeta'
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Ingresa un monto válido'
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Ingresa una descripción'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }, [formData])

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return !!(formData.cardId && 
      formData.amount && 
      parseFloat(formData.amount) > 0 && 
      formData.description.trim() &&
      !formErrors.cardId &&
      !formErrors.amount &&
      !formErrors.description)
  }, [formData, formErrors])

  // Form handlers
  const handleCardChange = useCallback((value: number | null) => {
    setFormData(prev => ({ ...prev, cardId: value }))
    if (formErrors.cardId) {
      setFormErrors(prev => ({ ...prev, cardId: undefined }))
    }
  }, [formErrors.cardId])

  const handleTypeChange = useCallback((value: OperationType) => {
    setFormData(prev => ({ ...prev, type: value }))
  }, [])

  const handleAmountChange = useCallback((value: number | null) => {
    setFormData(prev => ({ ...prev, amount: String(value ?? '') }))
    if (formErrors.amount) {
      setFormErrors(prev => ({ ...prev, amount: undefined }))
    }
  }, [formErrors.amount])

  const handleDescriptionChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, description: value }))
    if (formErrors.description) {
      setFormErrors(prev => ({ ...prev, description: undefined }))
    }
  }, [formErrors.description])

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData)
    setFormErrors({})
  }, [])

  // Handle form submit
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return

    await createOperation({
      cardId: formData.cardId!,
      type: formData.type,
      amount: parseFloat(formData.amount),
      description: formData.description,
    })

    // Reset form on success
    resetForm()
  }, [formData, validateForm, createOperation, resetForm])

  return {
    // Form state
    formData,
    formErrors,
    
    // Options
    cardOptions,
    typeOptions,
    
    // Handlers
    handleCardChange,
    handleTypeChange,
    handleAmountChange,
    handleDescriptionChange,
    handleSubmit,
    resetForm,
    
    // State
    isSubmitting,
    error,
    
    // Computed
    isFormValid,
  }
}

export default useOperationForm