import axios from 'axios'

const CLAVE_TOKEN = 'token'
const CLAVE_USUARIO = 'usuario'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(CLAVE_TOKEN)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(CLAVE_TOKEN)
      localStorage.removeItem(CLAVE_USUARIO)
      window.dispatchEvent(new Event('sesion-expirada'))
    }
    return Promise.reject(error)
  },
)

export default apiClient