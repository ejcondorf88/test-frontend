import { FC } from 'react'
import { Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { CreditCardsPage } from '@/pages/CreditCardsPage'
import { CreateCreditCardPage } from '@/pages/CreateCreditCardPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/credit-cards" element={<CreditCardsPage />} />
      <Route path="/credit-cards/new" element={<CreateCreditCardPage />} />
      <Route path="/credit-cards/:id" element={<CreditCardsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
