/**
 * CreditCardsPage
 * Page for displaying credit card list
 * Clean and simple - delegates logic to hooks and components
 */

import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'
import { CreditCardList } from '@/components/common/CreditCardList'

export const CreditCardsPage: FC = () => {
  const navigate = useNavigate()
  const toastRef = useRef<Toast>(null)

  // Handle view card details
  const handleViewCard = (id: number) => {
    navigate(`/credit-cards/${id}`)
  }

  return (
    <div className="p-6">
      <ConfirmDialog />
      <Toast ref={toastRef} />
      
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Tarjetas de Crédito
        </h1>
        <p className="text-gray-500 mt-1">
          Gestiona las tarjetas de crédito de tus clientes
        </p>
      </div>

      {/* Credit Card List */}
      <CreditCardList onViewCard={handleViewCard} />
    </div>
  )
}

export default CreditCardsPage
