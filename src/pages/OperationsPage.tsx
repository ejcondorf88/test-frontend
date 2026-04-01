/**
 * Operations Page
 * Page for managing credit card operations (consumption and payments)
 */

import { FC, useState } from 'react'
import { Card } from 'primereact/card'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'
import { useOperations } from '@/hooks'
import { OperationType, OperationFormData, OperationFormErrors } from '@/types/credit-card.types'

export const OperationsPage: FC = () => {
  const toast = useRef<Toast>(null)
  
  const {
    operations,
    activeCards,
    isLoading,
    isSubmitting,
    error,
    totalConsumption,
    totalPayments,
    createOperation,
    refetch,
  } = useOperations()

  // Form state
  const [formData, setFormData] = useState<OperationFormData>({
    cardId: null,
    type: 'CONSUMO',
    amount: '',
    description: '',
  })

  const [formErrors, setFormErrors] = useState<OperationFormErrors>({})

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(value)
  }

  // Card options for dropdown
  const cardOptions = activeCards.map(card => ({
    label: `${card.cardNumber} - ${card.holderName}`,
    value: card.id,
  }))

  // Type options for dropdown
  const typeOptions = [
    { label: 'Consumo', value: 'CONSUMO' },
    { label: 'Pago', value: 'PAGO' },
  ]

  // Validate form
  const validateForm = (): boolean => {
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
  }

  // Handle form submit
  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      await createOperation({
        cardId: formData.cardId!,
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
      })

      // Reset form
      setFormData({
        cardId: null,
        type: 'CONSUMO',
        amount: '',
        description: '',
      })

      toast.current?.show({
        severity: 'success',
        summary: 'Operación creada',
        detail: 'La operación se ha registrado correctamente',
        life: 3000,
      })
    } catch (err) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo crear la operación',
        life: 3000,
      })
    }
  }

  // Table templates
  const typeBodyTemplate = (rowData: { type: OperationType }) => {
    const isConsumo = rowData.type === 'CONSUMO'
    return (
      <span className={`p-tag ${isConsumo ? 'p-tag-warning' : 'p-tag-success'}`}>
        {isConsumo ? 'Consumo' : 'Pago'}
      </span>
    )
  }

  const amountBodyTemplate = (rowData: { amount: number; type: OperationType }) => {
    const isConsumo = rowData.type === 'CONSUMO'
    return (
      <span className={isConsumo ? 'text-red-600' : 'text-green-600'}>
        {isConsumo ? '-' : '+'}{formatCurrency(rowData.amount)}
      </span>
    )
  }

  const dateBodyTemplate = (rowData: { date: string }) => {
    return new Date(rowData.date).toLocaleDateString('es-MX')
  }

  const cardBodyTemplate = (rowData: { cardNumber: string }) => {
    return rowData.cardNumber
  }

  return (
    <div className="p-4">
      <Toast ref={toast} />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Operaciones</h1>
        <p className="text-gray-600 mt-2">
          Registra y gestiona las operaciones de tus tarjetas de crédito
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-lg" title="Total Consumos">
          <p className="text-3xl font-bold text-red-600">
            {formatCurrency(totalConsumption)}
          </p>
          <p className="text-sm text-gray-500 mt-2">Operaciones de consumo</p>
        </Card>

        <Card className="shadow-lg" title="Total Pagos">
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(totalPayments)}
          </p>
          <p className="text-sm text-gray-500 mt-2">Operaciones de pago</p>
        </Card>

        <Card className="shadow-lg" title="Operaciones">
          <p className="text-3xl font-bold text-blue-600">{operations.length}</p>
          <p className="text-sm text-gray-500 mt-2">Total de operaciones</p>
        </Card>
      </div>

      {/* Create Operation Form */}
      <Card className="shadow-lg mb-6" title="Nueva Operación">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-column gap-2">
            <label htmlFor="card" className="font-medium">
              Tarjeta *
            </label>
            <Dropdown
              id="card"
              value={formData.cardId}
              options={cardOptions}
              onChange={(e) => setFormData({ ...formData, cardId: e.value })}
              placeholder="Selecciona una tarjeta"
              className={formErrors.cardId ? 'p-invalid' : ''}
              filter
            />
            {formErrors.cardId && (
              <small className="p-error">{formErrors.cardId}</small>
            )}
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="type" className="font-medium">
              Tipo de Operación *
            </label>
            <Dropdown
              id="type"
              value={formData.type}
              options={typeOptions}
              onChange={(e) => setFormData({ ...formData, type: e.value as OperationType })}
            />
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="amount" className="font-medium">
              Monto *
            </label>
            <InputNumber
              id="amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: String(e.value ?? '') })}
              mode="currency"
              currency="MXN"
              locale="es-MX"
              className={formErrors.amount ? 'p-invalid' : ''}
            />
            {formErrors.amount && (
              <small className="p-error">{formErrors.amount}</small>
            )}
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="description" className="font-medium">
              Descripción *
            </label>
            <InputText
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ej: Supermercado, Restaurante, Pago mínimo"
              className={formErrors.description ? 'p-invalid' : ''}
            />
            {formErrors.description && (
              <small className="p-error">{formErrors.description}</small>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-content-end">
          <Button
            label="Registrar Operación"
            icon="pi pi-plus"
            onClick={handleSubmit}
            loading={isSubmitting}
          />
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-4 bg-red-100 border-round p-3">
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Operations Table */}
      <Card className="shadow-lg" title="Operaciones Registradas">
        <DataTable
          value={operations}
          loading={isLoading}
          paginator
          rows={10}
          emptyMessage="No hay operaciones registradas"
          className="p-datatable-sm"
          sortField="date"
          sortOrder={-1}
        >
          <Column field="type" header="Tipo" body={typeBodyTemplate} sortable />
          <Column field="cardNumber" header="Tarjeta" body={cardBodyTemplate} />
          <Column field="amount" header="Monto" body={amountBodyTemplate} sortable />
          <Column field="description" header="Descripción" />
          <Column field="date" header="Fecha" body={dateBodyTemplate} sortable />
        </DataTable>
      </Card>
    </div>
  )
}

export default OperationsPage