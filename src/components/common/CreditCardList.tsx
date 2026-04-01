/**
 * CreditCardList Component
 * Displays a grid of credit cards with filters and pagination
 */

import { FC } from 'react'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Paginator } from 'primereact/paginator'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Message } from 'primereact/message'
import { Button } from 'primereact/button'
import { CreditCardCard } from './CreditCardCard'
import { useCreditCardList, statusOptions } from '@/hooks/useCreditCardList'

interface CreditCardListProps {
  onViewCard?: (id: number) => void
}

export const CreditCardList: FC<CreditCardListProps> = ({ onViewCard }) => {
  const {
    cards,
    isLoading,
    error,
    page,
    totalPages,
    total,
    setPage,
    setStatusFilter,
    searchValue,
    setSearchValue,
    handleSearch,
    handleSearchKeyPress,
    handleStatusChange,
    isEmpty,
  } = useCreditCardList()

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <span className="p-input-icon-left w-full">
              <i className="pi pi-search" />
              <InputText
                placeholder="Buscar por nombre o número..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearchKeyPress}
                className="w-full"
              />
            </span>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-48">
            <Dropdown
              options={statusOptions}
              onChange={(e) => setStatusFilter(e.value)}
              placeholder="Estado"
              className="w-full"
            />
          </div>

          {/* Search Button */}
          <Button
            icon="pi pi-search"
            label="Buscar"
            onClick={handleSearch}
            className="md:w-auto"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Message severity="error" text={error.message || 'Error al cargar las tarjetas'} />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <ProgressSpinner />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && isEmpty && (
        <div className="text-center py-12">
          <i className="pi pi-credit-card text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No se encontraron tarjetas
          </h3>
          <p className="text-gray-500">
            Intenta con otros filtros de búsqueda
          </p>
        </div>
      )}

      {/* Cards Grid */}
      {!isLoading && !isEmpty && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <CreditCardCard
                key={card.id}
                card={card}
                onView={onViewCard}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Paginator
                first={(page - 1) * 10}
                rows={10}
                totalRecords={total}
                onPageChange={(e) => setPage(e.page + 1)}
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                currentPageReportTemplate={`Mostrando ${((page - 1) * 10) + 1}-${Math.min(page * 10, total)} de ${total}`}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CreditCardList