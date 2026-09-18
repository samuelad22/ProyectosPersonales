import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useIdioma } from '../context/IdiomaContext'
import SelectorIdioma from '../components/SelectorIdioma'

function LoginPage() {
  const { autenticado, iniciarSesion } = useAuth()
  const { t } = useIdioma()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  if (autenticado) {
    return <Navigate to="/libros" replace />
  }

  const manejarEnvio = async (evento) => {
    evento.preventDefault()
    setError('')
    setCargando(true)

    try {
      await iniciarSesion(email, password)
      navigate('/libros')
    } catch {
      setError(t('login.errorCredenciales'))
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-page">
      <div className="auth-card">
        <h1 className="auth-titulo">{t('login.titulo')}</h1>
        <form className="form" onSubmit={manejarEnvio} noValidate>
          <div className="form-campo">
            <label className="form-label" htmlFor="login-email">
              {t('comun.email')}
            </label>
            <input
              id="login-email"
              className="form-input"
              type="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              placeholder={t('login.placeholderEmail')}
              autoComplete="email"
              required
            />
          </div>
          <div className="form-campo">
            <label className="form-label" htmlFor="login-password">
              {t('comun.contrasena')}
            </label>
            <input
              id="login-password"
              className="form-input"
              type="password"
              value={password}
              onChange={(evento) => setPassword(evento.target.value)}
              placeholder={t('login.placeholderContrasena')}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary auth-boton" disabled={cargando}>
            {cargando ? t('login.cargando') : t('login.titulo')}
          </button>
        </form>
        <Link className="auth-enlace" to="/registro">
          {t('login.enlaceRegistro')}
        </Link>
        <SelectorIdioma />
      </div>
    </div>
  )
}

export default LoginPage