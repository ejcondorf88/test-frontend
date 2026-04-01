/**
 * Navbar Component
 * Main navigation bar with responsive design using PrimeReact Menubar
 */

import { FC } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menubar } from 'primereact/menubar'
import { Button } from 'primereact/button'
import './Navbar.css'

interface NavbarProps {
  // No props needed - uses fixed navigation items
}

export const Navbar: FC<NavbarProps> = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    {
      label: 'Tarjetas de Crédito',
      icon: 'pi pi-credit-card',
      command: () => navigate('/credit-cards'),
      className: location.pathname.startsWith('/credit-cards') ? 'p-menuitem-active' : '',
    },
    {
      label: 'Operaciones',
      icon: 'pi pi-chart-line',
      command: () => navigate('/operations'),
      className: location.pathname.startsWith('/operations') ? 'p-menuitem-active' : '',
    },
  ]

  const start = (
    <div className="navbar-brand">
      <i className="pi pi-wallet text-2xl mr-2" />
      <span className="font-bold text-xl">UQ AI</span>
    </div>
  )

  const end = (
    <div className="navbar-actions">
      <Button
        label="Mi Perfil"
        icon="pi pi-user"
        className="p-button-text p-button-plain"
        onClick={() => navigate('/profile')}
      />
    </div>
  )

  return (
    <nav className="navbar-container">
      <Menubar
        model={navItems}
        start={start}
        end={end}
        className="navbar-menubar"
      />
    </nav>
  )
}

export default Navbar
