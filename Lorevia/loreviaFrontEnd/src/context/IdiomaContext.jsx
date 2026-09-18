import { createContext, useContext } from 'react'

export const IdiomaContext = createContext(null)

export function useIdioma() {
  const contexto = useContext(IdiomaContext)

  if (!contexto) {
    throw new Error('useIdioma debe usarse dentro de un IdiomaProvider')
  }

  return contexto
}