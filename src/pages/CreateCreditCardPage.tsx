/**
 * CreateCreditCardPage
 * Page for creating a new credit card
 */

import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'
import { CreditCardForm } from '@/components/forms/CreditCardForm'

export const CreateCreditCardPage: FC = () => {
  const navigate = useNavigate()
  const toastRef = useRef<Toast>(null)

  const handleSuccess = () => {
    toastRef.current?.show({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Tarjeta creada correctamente',
      life: 3000,
    })
    // Navigate back after short delay
    setTimeout(() => {
      navigate('/credit-cards')
    }, 2000)
  }

  const handleCancel = () => {
    navigate('/credit-cards')
  }

  return (
    <div className="p-6">
      <ConfirmDialog />
      <Toast ref={toastRef} />
      
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Nueva Tarjeta de Crédito
        </h1>
        <p className="text-gray-500 mt-1">
          Complete los datos para crear una nueva tarjeta
        </p>
      </div>

      {/* Create Form */}
      <CreditCardForm 
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default CreateCreditCardPage
