/**
 * Operations Page
 * Placeholder for the Operations module
 */

import { FC } from 'react'
import { Card } from 'primereact/card'
import { Chart } from 'primereact/chart'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

export const OperationsPage: FC = () => {
  // Placeholder data for operations
  const recentOperations = [
    { id: 1, type: 'Pago', amount: 1500.00, date: '2024-01-15', card: '**** 1234' },
    { id: 2, type: 'Compra', amount: 250.50, date: '2024-01-14', card: '**** 5678' },
    { id: 3, type: 'Retiro', amount: 500.00, date: '2024-01-13', card: '**** 1234' },
  ]

  const lineChartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Gastos',
        data: [1200, 1900, 1500, 2200, 1800, 2500],
        fill: true,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#e5e7eb',
        },
      },
    },
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(value)
  }

  const amountBodyTemplate = (rowData: { amount: number }) => {
    return formatCurrency(rowData.amount)
  }

  const dateBodyTemplate = (rowData: { date: string }) => {
    return new Date(rowData.date).toLocaleDateString('es-MX')
  }

  const typeBodyTemplate = (rowData: { type: string }) => {
    const colors: Record<string, string> = {
      Pago: 'success',
      Compra: 'info',
      Retiro: 'warning',
    }
    return (
      <span className={`p-tag p-tag-${colors[rowData.type] || 'info'}`}>
        {rowData.type}
      </span>
    )
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Operaciones</h1>
        <p className="text-gray-600 mt-2">
          Visualiza y gestiona tus operaciones financieras
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-lg" title="Total Gastos">
          <p className="text-3xl font-bold text-red-600">
            {formatCurrency(12500.50)}
          </p>
          <p className="text-sm text-gray-500 mt-2">Últimos 30 días</p>
        </Card>

        <Card className="shadow-lg" title="Total Pagos">
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(8200.00)}
          </p>
          <p className="text-sm text-gray-500 mt-2">Últimos 30 días</p>
        </Card>

        <Card className="shadow-lg" title="Operaciones">
          <p className="text-3xl font-bold text-blue-600">24</p>
          <p className="text-sm text-gray-500 mt-2">Este mes</p>
        </Card>
      </div>

      {/* Chart */}
      <Card className="shadow-lg mb-6" title="Gastos por Mes">
        <div className="h-64">
          <Chart type="line" data={lineChartData} options={chartOptions} />
        </div>
      </Card>

      {/* Operations Table */}
      <Card className="shadow-lg" title="Operaciones Recientes">
        <DataTable
          value={recentOperations}
          paginator
          rows={5}
          emptyMessage="No hay operaciones recientes"
          className="p-datatable-sm"
        >
          <Column field="type" header="Tipo" body={typeBodyTemplate} sortable />
          <Column field="amount" header="Monto" body={amountBodyTemplate} sortable />
          <Column field="date" header="Fecha" body={dateBodyTemplate} sortable />
          <Column field="card" header="Tarjeta" />
        </DataTable>
      </Card>
    </div>
  )
}

export default OperationsPage
