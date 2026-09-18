import apiClient from './apiClient'

export async function listarLibros() {
  const { data } = await apiClient.get('/api/libros')
  return data
}

export async function obtenerLibro(id) {
  const { data } = await apiClient.get(`/api/libros/${id}`)
  return data
}

export async function crearLibro(libro) {
  const { data } = await apiClient.post('/api/libros', libro)
  return data
}

export async function actualizarLibro(id, libro) {
  const { data } = await apiClient.put(`/api/libros/${id}`, libro)
  return data
}

export async function eliminarLibro(id) {
  await apiClient.delete(`/api/libros/${id}`)
}

export async function asignarCategorias(id, idsCategorias) {
  const { data } = await apiClient.post(`/api/libros/${id}/categorias`, idsCategorias)
  return data
}

export async function desasignarCategoria(id, idCategoria) {
  await apiClient.delete(`/api/libros/${id}/categorias/${idCategoria}`)
}