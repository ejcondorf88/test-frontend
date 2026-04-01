import { FC } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppRoutes } from './router/AppRoutes'
import { Navbar } from './components/common/Navbar'

// Create a client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
    },
  },
})

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="app-main">
            <AppRoutes />
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
