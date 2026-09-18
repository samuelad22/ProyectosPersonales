import apiClient from './apiClient'

export async function listarCategorias() {
  const { data } = await apiClient.get('/api/categorias')
  return data
}

export async function crearCategoria(categoria) {
  const { data } = await apiClient.post('/api/categorias', categoria)
  return data
}

export async function actualizarCategoria(id, categoria) {
  const { data } = await apiClient.put(`/api/categorias/${id}`, categoria)
  return data
}

export async function eliminarCategoria(id) {
  await apiClient.delete(`/api/categorias/${id}`)
}