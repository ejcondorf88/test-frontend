import { FC } from 'react'
import { Link } from 'react-router-dom'

export const HomePage: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          React App
        </h1>
        <p className="text-gray-600 mb-8">
          Proyecto configurado y listo para desarrollar
        </p>
        
        {/* Navigation Links */}
        <div className="space-y-3">
          <Link
            to="/credit-cards"
            className="block w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <i className="pi pi-credit-card mr-2" />
            Tarjetas de Crédito
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
