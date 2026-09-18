import apiClient from './apiClient'

export async function listarPersonajes() {
  const { data } = await apiClient.get('/api/personajes')
  return data
}

export async function crearPersonaje(personaje) {
  const { data } = await apiClient.post('/api/personajes', personaje)
  return data
}

export async function actualizarPersonaje(id, personaje) {
  const { data } = await apiClient.put(`/api/personajes/${id}`, personaje)
  return data
}

export async function eliminarPersonaje(id) {
  await apiClient.delete(`/api/personajes/${id}`)
}