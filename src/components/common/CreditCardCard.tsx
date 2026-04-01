/**
 * CreditCard Card Component
 * Displays a single credit card with rotation/flip effect and status dropdown
 */

import { FC, useState } from 'react'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { SelectButton } from 'primereact/selectbutton'
import { CreditCard, CreditCardStatus } from '@/types/credit-card.types'
import { formatCurrency } from '@/utils/common.utils'
import { formatDate } from '@/utils/common.utils'
import './CreditCardCard.css'

interface CreditCardCardProps {
  card: CreditCard
  onView?: (id: number) => void
  onStatusChange?: (id: number, status: CreditCardStatus) => Promise<void>
}

export const CreditCardCard: FC<CreditCardCardProps> = ({
  card,
  onView,
  onStatusChange,
}) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const isActive = card.status === 'ACTIVA'

  // Mask card number (show last 4 digits)
  const maskedNumber = `**** **** **** ${card.cardNumber.slice(-4)}`

  // Calculate usage percentage
  const usagePercent = ((card.creditLimit - card.availableBalance) / card.creditLimit) * 100

  const handleClick = () => {
    setIsFlipped(!isFlipped)
  }

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation()
    action()
  }

  const handleStatusChange = async (newStatus: CreditCardStatus) => {
    if (newStatus === card.status) return
    
    setIsUpdating(true)
    try {
      await onStatusChange?.(card.id, newStatus)
    } catch (error) {
      // Error handled in parent
    } finally {
      setIsUpdating(false)
    }
  }

  // Status options for dropdown
  const statusOptions = [
    { label: 'Activa', value: 'ACTIVA' },
    { label: 'Bloqueada', value: 'BLOQUEADA' },
  ]

  return (
    <div className="credit-card-container" onClick={handleClick}>
      <div className={`credit-card ${isFlipped ? 'flipped' : ''}`}>
        
        {/* FRONT OF CARD */}
        <div className="credit-card-face credit-card-front">
          <div className={`bg-gradient-to-br rounded-2xl p-6 shadow-2xl h-full flex flex-col justify-between ${isActive ? 'from-slate-800 via-slate-700 to-slate-900 border-slate-600' : 'from-gray-600 via-gray-500 to-gray-700 border-gray-400'}`}>
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className={`w-12 h-8 rounded-md ${isActive ? 'bg-gradient-to-r from-amber-400 to-amber-600 opacity-80' : 'bg-gradient-to-r from-gray-400 to-gray-500 opacity-60'}`} />
              <Tag
                value={isActive ? 'Activa' : 'Bloqueada'}
                severity={isActive ? 'success' : 'danger'}
                rounded
                className="text-xs"
              />
            </div>

            {/* Card Number */}
            <div className="mt-4">
              <p className={`text-sm mb-1 ${isActive ? 'text-white/80' : 'text-gray-300/80'}`}>Número de tarjeta</p>
              <p className={`text-xl font-mono tracking-widest ${isActive ? 'text-white' : 'text-gray-300'}`}>
                {maskedNumber}
              </p>
            </div>

            {/* Card Holder & Expiry */}
            <div className="flex justify-between items-end">
              <div>
                <p className={`text-xs ${isActive ? 'text-white/60' : 'text-gray-400/60'}`}>Titular</p>
                <p className={`text-lg uppercase tracking-wide ${isActive ? 'text-white font-semibold' : 'text-gray-300 font-semibold'}`}>
                  {card.holderName}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-xs ${isActive ? 'text-white/60' : 'text-gray-400/60'}`}>Creada</p>
                <p className={`text-sm ${isActive ? 'text-white' : 'text-gray-300'}`}>
                  {formatDate(card.createdAt, { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Flip hint */}
            <div className={`absolute bottom-3 right-4 text-xs ${isActive ? 'text-white/40' : 'text-gray-400/40'}`}>
              <i className="pi pi-sync mr-1" />
              Click para ver detalles
            </div>
          </div>
        </div>

        {/* BACK OF CARD */}
        <div className="credit-card-face credit-card-back">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-200 h-full flex flex-col">
            {/* Credit Info */}
            <div className="space-y-4 flex-1">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Límite de crédito</span>
                <span className="text-xl font-bold text-gray-800">
                  {formatCurrency(card.creditLimit)}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Disponible</span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(card.availableBalance)}
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Uso del crédito</span>
                  <span>{usagePercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      usagePercent > 80 ? 'bg-red-500' : 
                      usagePercent > 50 ? 'bg-amber-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>

              {/* Status Change - Only allow change for active cards */}
              <div className="pt-2">
                <label className="text-gray-500 text-xs block mb-1">
                  {isActive ? 'Cambiar Estado' : 'Estado'}
                </label>
                <SelectButton
                  value={card.status}
                  options={statusOptions}
                  optionLabel="label"
                  optionValue="value"
                  onChange={(e) => handleStatusChange(e.value as CreditCardStatus)}
                  disabled={isUpdating || !isActive}
                  className="w-full"
                />
                {!isActive && (
                  <small className="text-red-500 text-xs mt-1 block">
                    Tarjeta bloqueada. Contacte al administrador para desbloquear.
                  </small>
                )}
              </div>

              <div className="pt-2 text-xs text-gray-400">
                <p>Creada: {formatDate(card.createdAt)}</p>
                <p>Actualizada: {formatDate(card.updatedAt)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-3 pt-4 border-t border-gray-100 mt-4">
              <Button
                icon="pi pi-eye"
                rounded
                severity="secondary"
                tooltip="Ver detalles"
                tooltipOptions={{ position: 'top' }}
                onClick={(e) => handleAction(e, () => onView?.(card.id))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreditCardCard
