/**
 * CreditCardsPage
 * Page for displaying credit card list with modal for creating new cards
 */

import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { CreditCardList } from '@/components/common/CreditCardList'
import { CreditCardForm } from '@/components/forms/CreditCardForm'

export const CreditCardsPage: FC = () => {
  const navigate = useNavigate()
  const toastRef = useRef<Toast>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Handle view card details
  const handleViewCard = (id: number) => {
    navigate(`/credit-cards/${id}`)
  }

  // Handle successful creation - React Query handles cache invalidation automatically
  const handleCreateSuccess = () => {
    setShowCreateModal(false)
    toastRef.current?.show({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Tarjeta creada correctamente',
      life: 3000,
    })
  }

  return (
    <div className="p-6">
      <ConfirmDialog />
      <Toast ref={toastRef} />
      
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Tarjetas de Crédito
          </h1>
          <p className="text-gray-500 mt-1">
            Gestiona las tarjetas de crédito de tus clientes
          </p>
        </div>
        <Button
          label="Nueva Tarjeta"
          icon="pi pi-plus"
          onClick={() => setShowCreateModal(true)}
          className="md:w-auto"
        />
      </div>

      {/* Credit Card List */}
      <CreditCardList 
        onViewCard={handleViewCard} 
      />

      {/* Create Modal */}
      <Dialog
        visible={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        header="Nueva Tarjeta de Crédito"
        modal
        style={{ width: '50vw', maxWidth: '600px' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        closable
        draggable={false}
      >
        <CreditCardForm 
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Dialog>
    </div>
  )
}

export default CreditCardsPage
