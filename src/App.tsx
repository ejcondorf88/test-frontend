import { FC } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './router/AppRoutes'
import { Navbar } from './components/common/Navbar'

const App: FC = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="app-main">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
