import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import App from './App'
import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById('root')).render(
  <ThemeProvider><App/></ThemeProvider>
)
