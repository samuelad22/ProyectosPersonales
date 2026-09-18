import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './styles/componentes.css'
import './styles/layout.css'
import './styles/animaciones.css'
import AuthProvider from './context/AuthProvider'
import IdiomaProvider from './context/IdiomaProvider'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import RegistroPage from './pages/RegistroPage'
import LibrosPage from './pages/LibrosPage'
import LibroDetallePage from './pages/LibroDetallePage'
import PersonajesPage from './pages/PersonajesPage'
import CategoriasPage from './pages/CategoriasPage'

function App() {
  return (
    <BrowserRouter>
      <IdiomaProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegistroPage />} />
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Navigate to="/libros" replace />} />
              <Route path="/libros" element={<LibrosPage />} />
              <Route path="/libros/:id" element={<LibroDetallePage />} />
              <Route path="/personajes" element={<PersonajesPage />} />
              <Route path="/categorias" element={<CategoriasPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </IdiomaProvider>
    </BrowserRouter>
  )
}

export default App