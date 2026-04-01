import { FC } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'

export const NotFoundPage: FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
      <Link to="/">
        <Button label="Volver al inicio" icon="pi pi-home" />
      </Link>
    </div>
  )
}

export default NotFoundPage
