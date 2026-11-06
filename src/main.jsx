import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import './index.css'
import './App.css'
import "./styles/globals.css";
import "./styles/tokens.css";
import "./styles/admin-kit.css";
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </AuthProvider>
  </StrictMode>,
)