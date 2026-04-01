/**
 * useCreateCreditCard Hook
 * Custom hook for creating a new credit card
 * Handles: form state, validation, submission using React Query
 */

import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { creditCardApi } from '@/api/endpoints'
import { 
  CreditCardFormData, 
  CreditCardFormErrors, 
  CreditCardStatus,
  CreditCardCreateRequest 
} from '@/types/credit-card.types'
import { queryKeys } from './useQueries'

interface UseCreateCreditCardReturn {
  // Form state
  formData: CreditCardFormData
  errors: CreditCardFormErrors
  isSubmitting: boolean
  isSuccess: boolean
  error: Error | null
  
  // Actions
  handleChange: (field: keyof CreditCardFormData, value: string) => void
  handleStatusChange: (status: CreditCardStatus) => void
  validate: () => boolean
  submit: () => Promise<boolean>
  reset: () => void
}

const initialFormData: CreditCardFormData = {
  cardNumber: '',
  holderName: '',
  creditLimit: '',
  availableBalance: '',
  status: 'ACTIVA',
}

export function useCreateCreditCard(): UseCreateCreditCardReturn {
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState<CreditCardFormData>(initialFormData)
  const [errors, setErrors] = useState<CreditCardFormErrors>({})
  
  // React Query mutation for creating credit card
  const createMutation = useMutation({
    mutationFn: (data: CreditCardCreateRequest) => creditCardApi.create(data),
    onSuccess: () => {
      // Invalidate credit cards list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.creditCards.all })
    },
  })
  
  // Handle text input changes
  const handleChange = useCallback((field: keyof CreditCardFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])
  
  // Handle status change
  const handleStatusChange = useCallback((status: CreditCardStatus) => {
    setFormData(prev => ({ ...prev, status }))
  }, [])
  
  // Validate form
  const validate = useCallback((): boolean => {
    const newErrors: CreditCardFormErrors = {}
    
    // Card number validation (13-19 digits)
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'El número de tarjeta es requerido'
    } else if (!/^\d{13,19}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'El número de tarjeta debe tener entre 13 y 19 dígitos'
    }
    
    // Holder name validation
    if (!formData.holderName.trim()) {
      newErrors.holderName = 'El nombre del titular es requerido'
    } else if (formData.holderName.trim().length > 150) {
      newErrors.holderName = 'El nombre no puede exceder 150 caracteres'
    }
    
    // Credit limit validation
    if (!formData.creditLimit.trim()) {
      newErrors.creditLimit = 'El límite de crédito es requerido'
    } else if (isNaN(Number(formData.creditLimit)) || Number(formData.creditLimit) < 0) {
      newErrors.creditLimit = 'Ingrese un valor numérico válido'
    }
    
    // Available balance validation
    if (!formData.availableBalance.trim()) {
      newErrors.availableBalance = 'El saldo disponible es requerido'
    } else if (isNaN(Number(formData.availableBalance)) || Number(formData.availableBalance) < 0) {
      newErrors.availableBalance = 'Ingrese un valor numérico válido'
    } else if (Number(formData.availableBalance) > Number(formData.creditLimit)) {
      newErrors.availableBalance = 'No puede ser mayor al límite de crédito'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])
  
  // Submit form
  const submit = useCallback(async (): Promise<boolean> => {
    if (!validate()) {
      return false
    }
    
    const requestData: CreditCardCreateRequest = {
      cardNumber: formData.cardNumber.replace(/\s/g, ''),
      holderName: formData.holderName.trim(),
      creditLimit: Number(formData.creditLimit),
      availableBalance: Number(formData.availableBalance),
      status: formData.status,
    }
    
    try {
      await createMutation.mutateAsync(requestData)
      return true
    } catch (err) {
      // Error is handled by React Query, but we can also set it here if needed
      return false
    }
  }, [formData, validate, createMutation])
  
  // Reset form
  const reset = useCallback(() => {
    setFormData(initialFormData)
    setErrors({})
  }, [])
  
  return {
    formData,
    errors,
    isSubmitting: createMutation.isPending,
    isSuccess: createMutation.isSuccess,
    error: createMutation.error as Error | null,
    handleChange,
    handleStatusChange,
    validate,
    submit,
    reset,
  }
}

export default useCreateCreditCard