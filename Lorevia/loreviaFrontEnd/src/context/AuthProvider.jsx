import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import { AuthContext } from './AuthContext'

const CLAVE_TOKEN = 'token'
const CLAVE_USUARIO = 'usuario'

function leerToken() {
  return localStorage.getItem(CLAVE_TOKEN)
}

function leerUsuario() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_USUARIO))
  } catch {
    return null
  }
}

function extraerUsuario(datos) {
  return {
    id: datos.id,
    nombreUsuario: datos.nombreUsuario,
    nombreReal: datos.nombreReal,
    apellidos: datos.apellidos,
    email: datos.email,
    rol: datos.rol,
  }
}

function guardarSesion(token, datosUsuario) {
  localStorage.setItem(CLAVE_TOKEN, token)
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(datosUsuario))
}

function AuthProvider({ children }) {
  const [token, setToken] = useState(leerToken)
  const [usuario, setUsuario] = useState(leerUsuario)
  const navigate = useNavigate()

  useEffect(() => {
    const manejarSesionExpirada = () => {
      setToken(null)
      setUsuario(null)
      navigate('/login')
    }

    window.addEventListener('sesion-expirada', manejarSesionExpirada)

    return () => {
      window.removeEventListener('sesion-expirada', manejarSesionExpirada)
    }
  }, [navigate])

  async function iniciarSesion(email, password) {
    const { data } = await apiClient.post('/api/auth/login', { email, password })
    const datosUsuario = extraerUsuario(data)

    guardarSesion(data.token, datosUsuario)
    setToken(data.token)
    setUsuario(datosUsuario)

    return data
  }

  async function registrarse(datos) {
    const { data } = await apiClient.post('/api/auth/registro', datos)

    if (data.token) {
      const datosUsuario = extraerUsuario(data)
      guardarSesion(data.token, datosUsuario)
      setToken(data.token)
      setUsuario(datosUsuario)
    }

    return data
  }

  function cerrarSesion() {
    localStorage.removeItem(CLAVE_TOKEN)
    localStorage.removeItem(CLAVE_USUARIO)
    setToken(null)
    setUsuario(null)
  }

  const valor = {
    token,
    usuario,
    autenticado: Boolean(token),
    iniciarSesion,
    registrarse,
    cerrarSesion,
  }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export default AuthProvider