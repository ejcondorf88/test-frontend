/**
 * Operations Page
 * Manejo de operaciones (CONSUMO/PAGO) usando Operations Service
 */

import { FC, useRef } from 'react'
import { Card } from 'primereact/card'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useOperations } from '@/hooks'

export const OperationsPage: FC = () => {
  const toast = useRef<Toast>(null)
  
  const {
    activeCards,
    isLoadingCards,
    isProcessing,
    error,
    formData,
    formErrors,
    cardOptions,
    setFormField,
    handleSubmit,
    resetForm,
  } = useOperations()

  // Operation type options
  const operationOptions = [
    { label: 'Consumo (-)', value: 'CONSUMO' },
    { label: 'Pago (+)', value: 'PAGO' },
  ]

  // Submit handler
  const onSubmit = async () => {
    try {
      await handleSubmit()
      toast.current?.show({
        severity: 'success',
        summary: 'Operación exitosa',
        detail: formData.operation === 'CONSUMO' 
          ? 'Consumo registrado' 
          : 'Pago registrado',
        life: 3000,
      })
    } catch (err) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.message || 'No se pudo completar',
        life: 3000,
      })
    }
  }

  if (isLoadingCards) {
    return (
      <div className="flex justify-center items-center h-64">
        <ProgressSpinner />
      </div>
    )
  }

  return (
    <div className="p-4">
      <Toast ref={toast} />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Operaciones</h1>
        <p className="text-gray-600 mt-2">
          Registra consumos y pagos en tus tarjetas de crédito
        </p>
      </div>

      {error && (
        <div className="p-4 mb-4 bg-red-100 border-round">
          <span className="text-red-700">{error.message}</span>
        </div>
      )}

      {/* Form */}
      <Card className="shadow-lg mb-6" title="Nueva Operación">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Selection */}
          <div className="flex flex-column gap-2">
            <label className="font-medium">Tarjeta *</label>
            <Dropdown
              value={formData.cardId}
              options={cardOptions}
              onChange={(e) => setFormField('cardId', e.value)}
              placeholder="Selecciona una tarjeta"
              className={formErrors.cardId ? 'p-invalid' : ''}
              filter
            />
            {formErrors.cardId && <small className="p-error">{formErrors.cardId}</small>}
          </div>

          {/* Operation Type */}
          <div className="flex flex-column gap-2">
            <label className="font-medium">Tipo *</label>
            <Dropdown
              value={formData.operation}
              options={operationOptions}
              onChange={(e) => setFormField('operation', e.value)}
            />
          </div>

          {/* Amount */}
          <div className="flex flex-column gap-2">
            <label className="font-medium">Monto *</label>
            <InputNumber
              value={formData.amount ? parseFloat(formData.amount) : null}
              onChange={(e) => setFormField('amount', e.value?.toString() || '')}
              mode="currency"
              currency="MXN"
              className={formErrors.amount ? 'p-invalid' : ''}
            />
            {formErrors.amount && <small className="p-error">{formErrors.amount}</small>}
          </div>

          {/* Description */}
          <div className="flex flex-column gap-2">
            <label className="font-medium">Descripción {formData.operation === 'CONSUMO' ? '*' : ''}</label>
            <InputText
              value={formData.description}
              onChange={(e) => setFormField('description', e.target.value)}
              placeholder={formData.operation === 'CONSUMO' ? "Ej: Supermercado" : "Opcional"}
              className={formErrors.description ? 'p-invalid' : ''}
            />
            {formErrors.description && <small className="p-error">{formErrors.description}</small>}
          </div>
        </div>

        <div className="mt-4 flex justify-content-end gap-2">
          <Button label="Limpiar" icon="pi pi-times" severity="secondary" onClick={resetForm} disabled={isProcessing} />
          <Button
            label={isProcessing ? 'Procesando...' : 'Registrar'}
            icon={isProcessing ? 'pi pi-spinner' : 'pi pi-plus'}
            onClick={onSubmit}
            loading={isProcessing}
          />
        </div>
      </Card>

      {/* Active Cards */}
      <Card className="shadow-lg" title="Tarjetas Activas">
        {activeCards.length === 0 ? (
          <p className="text-gray-500">No hay tarjetas activas</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCards.map((card) => (
              <div key={card.id} className="p-4 border rounded-lg">
                <div className="font-semibold">{card.holderName}</div>
                <div className="text-sm text-gray-500">{card.cardNumber}</div>
                <div className="text-sm mt-2">
                  <span className={card.availableBalance < card.creditLimit * 0.2 ? 'text-red-600' : 'text-green-600'}>
                    Disponible: ${card.availableBalance.toLocaleString('es-MX')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default OperationsPage