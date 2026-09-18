import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useIdioma } from '../context/IdiomaContext'
import SelectorIdioma from './SelectorIdioma'

function Layout() {
  const { usuario, cerrarSesion } = useAuth()
  const { t } = useIdioma()
  const navigate = useNavigate()

  const manejarCerrarSesion = () => {
    cerrarSesion()
    navigate('/login')
  }

  return (
    <div className="layout">
      <header className="nav-bar">
        <nav className="nav-enlaces" aria-label={t('nav.aria')}>
          <NavLink
            to="/libros"
            className={({ isActive }) => `nav-enlace${isActive ? ' nav-enlace-activo' : ''}`}
          >
            {t('nav.libros')}
          </NavLink>
          <NavLink
            to="/personajes"
            className={({ isActive }) => `nav-enlace${isActive ? ' nav-enlace-activo' : ''}`}
          >
            {t('nav.personajes')}
          </NavLink>
          <NavLink
            to="/categorias"
            className={({ isActive }) => `nav-enlace${isActive ? ' nav-enlace-activo' : ''}`}
          >
            {t('nav.categorias')}
          </NavLink>
        </nav>
        <div className="nav-usuario">
          <span className="nav-usuario-nombre">{usuario?.nombreUsuario ?? usuario?.email}</span>
          <SelectorIdioma />
          <button type="button" className="btn btn-ghost" onClick={manejarCerrarSesion}>
            {t('nav.cerrarSesion')}
          </button>
        </div>
      </header>
      <main className="layout-contenido">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout