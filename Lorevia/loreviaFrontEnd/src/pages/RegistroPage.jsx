import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useIdioma } from '../context/IdiomaContext'
import SelectorIdioma from '../components/SelectorIdioma'

const EXPRESION_EMAIL = /^\S+@\S+\.\S+$/

function RegistroPage() {
  const { autenticado, registrarse } = useAuth()
  const { t } = useIdioma()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmacion, setConfirmacion] = useState('')
  const [nombreUsuario, setNombreUsuario] = useState('')
  const [nombreReal, setNombreReal] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  if (autenticado) {
    return <Navigate to="/libros" replace />
  }

  const manejarEnvio = async (evento) => {
    evento.preventDefault()

    if (!nombreUsuario.trim() || !nombreReal.trim() || !apellidos.trim() || !email.trim() || !password || !confirmacion) {
      setError(t('registro.errorCampos'))
      return
    }

    if (!EXPRESION_EMAIL.test(email)) {
      setError(t('registro.errorEmail'))
      return
    }

    if (password !== confirmacion) {
      setError(t('registro.errorContrasenas'))
      return
    }

    setError('')
    setCargando(true)

    try {
      const datos = await registrarse({
        email: email.trim(),
        password,
        nombreUsuario: nombreUsuario.trim(),
        nombreReal: nombreReal.trim(),
        apellidos: apellidos.trim(),
      })
      navigate(datos.token ? '/libros' : '/login')
    } catch {
      setError(t('registro.errorRegistro'))
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="registro-page">
      <div className="auth-card">
        <h1 className="auth-titulo">{t('registro.titulo')}</h1>
        <form className="form" onSubmit={manejarEnvio} noValidate>
          <div className="form-campo">
            <label className="form-label" htmlFor="registro-nombre-usuario">
              {t('registro.nombreUsuario')}
            </label>
            <input
              id="registro-nombre-usuario"
              className="form-input"
              type="text"
              value={nombreUsuario}
              onChange={(evento) => setNombreUsuario(evento.target.value)}
              placeholder={t('registro.placeholderNombreUsuario')}
              autoComplete="username"
              required
            />
          </div>
          <div className="form-campo">
            <label className="form-label" htmlFor="registro-nombre-real">
              {t('registro.nombreReal')}
            </label>
            <input
              id="registro-nombre-real"
              className="form-input"
              type="text"
              value={nombreReal}
              onChange={(evento) => setNombreReal(evento.target.value)}
              placeholder={t('registro.placeholderNombreReal')}
              autoComplete="given-name"
              required
            />
          </div>
          <div className="form-campo">
            <label className="form-label" htmlFor="registro-apellidos">
              {t('registro.apellidos')}
            </label>
            <input
              id="registro-apellidos"
              className="form-input"
              type="text"
              value={apellidos}
              onChange={(evento) => setApellidos(evento.target.value)}
              placeholder={t('registro.placeholderApellidos')}
              autoComplete="family-name"
              required
            />
          </div>
          <div className="form-campo">
            <label className="form-label" htmlFor="registro-email">
              {t('comun.email')}
            </label>
            <input
              id="registro-email"
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
            <label className="form-label" htmlFor="registro-password">
              {t('comun.contrasena')}
            </label>
            <input
              id="registro-password"
              className="form-input"
              type="password"
              value={password}
              onChange={(evento) => setPassword(evento.target.value)}
              placeholder={t('registro.placeholderContrasena')}
              autoComplete="new-password"
              required
            />
          </div>
          <div className="form-campo">
            <label className="form-label" htmlFor="registro-confirmacion">
              {t('registro.confirmarContrasena')}
            </label>
            <input
              id="registro-confirmacion"
              className="form-input"
              type="password"
              value={confirmacion}
              onChange={(evento) => setConfirmacion(evento.target.value)}
              placeholder={t('registro.placeholderConfirmacion')}
              autoComplete="new-password"
              required
            />
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary auth-boton" disabled={cargando}>
            {cargando ? t('registro.cargando') : t('registro.boton')}
          </button>
        </form>
        <Link className="auth-enlace" to="/login">
          {t('registro.enlaceLogin')}
        </Link>
        <SelectorIdioma />
      </div>
    </div>
  )
}

export default RegistroPage