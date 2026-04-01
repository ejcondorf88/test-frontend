/**
 * CreditCard Card Component
 * Displays a single credit card with rotation/flip effect
 */

import { FC, useState } from 'react'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { CreditCard as CreditCardType } from '@/types/credit-card.types'
import { formatCurrency } from '@/utils/common.utils'
import { formatDate } from '@/utils/common.utils'
import './CreditCardCard.css'

interface CreditCardCardProps {
  card: CreditCardType
  onBlock?: (id: number) => void
  onActivate?: (id: number) => void
  onView?: (id: number) => void
}

export const CreditCardCard: FC<CreditCardCardProps> = ({
  card,
  onBlock,
  onActivate,
  onView,
}) => {
  const [isFlipped, setIsFlipped] = useState(false)
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

  return (
    <div className="credit-card-container" onClick={handleClick}>
      <div className={`credit-card ${isFlipped ? 'flipped' : ''}`}>
        
        {/* FRONT OF CARD */}
        <div className="credit-card-face credit-card-front">
          <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-600 h-full flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="w-12 h-8 bg-gradient-to-r from-amber-400 to-amber-600 rounded-md opacity-80" />
              <Tag
                value={isActive ? 'Activa' : 'Bloqueada'}
                severity={isActive ? 'success' : 'danger'}
                rounded
                className="text-xs"
              />
            </div>

            {/* Card Number */}
            <div className="mt-4">
              <p className="text-white/80 text-sm mb-1">Número de tarjeta</p>
              <p className="text-white text-xl font-mono tracking-widest">
                {maskedNumber}
              </p>
            </div>

            {/* Card Holder & Expiry */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/60 text-xs">Titular</p>
                <p className="text-white font-semibold text-lg uppercase tracking-wide">
                  {card.holderName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-xs">Creada</p>
                <p className="text-white text-sm">
                  {formatDate(card.createdAt, { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Flip hint */}
            <div className="absolute bottom-3 right-4 text-white/40 text-xs">
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
              {isActive ? (
                <Button
                  icon="pi pi-lock"
                  rounded
                  severity="danger"
                  tooltip="Bloquear"
                  tooltipOptions={{ position: 'top' }}
                  onClick={(e) => handleAction(e, () => onBlock?.(card.id))}
                />
              ) : (
                <Button
                  icon="pi pi-unlock"
                  rounded
                  severity="success"
                  tooltip="Activar"
                  tooltipOptions={{ position: 'top' }}
                  onClick={(e) => handleAction(e, () => onActivate?.(card.id))}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreditCardCard
