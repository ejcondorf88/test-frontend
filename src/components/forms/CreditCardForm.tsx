/**
 * CreditCardForm Component
 * Form for creating a new credit card
 */

import { FC, useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'
import { useCreateCreditCard } from '@/hooks/useCreateCreditCard'
import { CreditCardStatus } from '@/types/credit-card.types'

// Status options
const statusOptions = [
  { label: 'Activa', value: 'ACTIVA' },
  { label: 'Bloqueada', value: 'BLOQUEADA' },
]

interface CreditCardFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export const CreditCardForm: FC<CreditCardFormProps> = ({ onSuccess, onCancel }) => {
  const {
    formData,
    errors,
    isSubmitting,
    error,
    handleChange,
    handleStatusChange,
    submit,
    reset,
  } = useCreateCreditCard()

  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async () => {
    const success = await submit()
    if (success) {
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        reset()
        onSuccess?.()
      }, 2000)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        <i className="pi pi-credit-card mr-2" />
        Nueva Tarjeta de Crédito
      </h2>

      {/* Error Message */}
      {error && (
        <Message severity="error" text={error} className="mb-4" />
      )}

      {/* Success Message */}
      {showSuccess && (
        <Message severity="success" text="Tarjeta creada exitosamente!" className="mb-4" />
      )}

      {/* Form */}
      <div className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de Tarjeta *
          </label>
          <InputText
            value={formData.cardNumber}
            onChange={(e) => handleChange('cardNumber', e.target.value)}
            placeholder="4532015112830366"
            className={`w-full ${errors.cardNumber ? 'p-invalid' : ''}`}
            maxLength={19}
            keyfilter="num"
          />
          {errors.cardNumber && (
            <small className="p-error">{errors.cardNumber}</small>
          )}
          <small className="text-gray-500 text-xs">
            Entre 13 y 19 dígitos
          </small>
        </div>

        {/* Holder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Titular *
          </label>
          <InputText
            value={formData.holderName}
            onChange={(e) => handleChange('holderName', e.target.value)}
            placeholder="Juan Pérez"
            className={`w-full ${errors.holderName ? 'p-invalid' : ''}`}
          />
          {errors.holderName && (
            <small className="p-error">{errors.holderName}</small>
          )}
        </div>

        {/* Credit Limit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Límite de Crédito *
          </label>
          <InputNumber
            value={formData.creditLimit ? Number(formData.creditLimit) : null}
            onValueChange={(e) => handleChange('creditLimit', String(e.value ?? ''))}
            mode="currency"
            currency="EUR"
            locale="es-ES"
            placeholder="5000.00"
            className={`w-full ${errors.creditLimit ? 'p-invalid' : ''}`}
            min={0}
          />
          {errors.creditLimit && (
            <small className="p-error">{errors.creditLimit}</small>
          )}
        </div>

        {/* Available Balance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Saldo Disponible *
          </label>
          <InputNumber
            value={formData.availableBalance ? Number(formData.availableBalance) : null}
            onValueChange={(e) => handleChange('availableBalance', String(e.value ?? ''))}
            mode="currency"
            currency="EUR"
            locale="es-ES"
            placeholder="5000.00"
            className={`w-full ${errors.availableBalance ? 'p-invalid' : ''}`}
            min={0}
          />
          {errors.availableBalance && (
            <small className="p-error">{errors.availableBalance}</small>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado *
          </label>
          <Dropdown
            value={formData.status}
            options={statusOptions}
            onChange={(e) => handleStatusChange(e.value as CreditCardStatus)}
            className="w-full"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        {onCancel && (
          <Button
            label="Cancelar"
            icon="pi pi-times"
            severity="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          />
        )}
        <Button
          label={isSubmitting ? 'Creando...' : 'Crear Tarjeta'}
          icon={isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </div>
    </div>
  )
}

export default CreditCardForm
