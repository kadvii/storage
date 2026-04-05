import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { InventoryProvider } from './context/InventoryContext'
import { ThemeProvider } from './context/ThemeContext'
import { WarehouseProvider } from './context/WarehouseContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <WarehouseProvider>
          <InventoryProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </InventoryProvider>
        </WarehouseProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
