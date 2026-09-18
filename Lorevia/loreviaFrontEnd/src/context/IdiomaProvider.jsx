import { useCallback, useEffect, useMemo, useState } from 'react'
import { CLAVE_IDIOMA, IDIOMAS, IDIOMA_POR_DEFECTO } from '../i18n/idiomas'
import { IdiomaContext } from './IdiomaContext'

function leerIdiomaInicial() {
  const guardado = localStorage.getItem(CLAVE_IDIOMA)
  return IDIOMAS[guardado] ? guardado : IDIOMA_POR_DEFECTO
}

function IdiomaProvider({ children }) {
  const [idioma, setIdioma] = useState(leerIdiomaInicial)

  useEffect(() => {
    document.documentElement.lang = idioma
  }, [idioma])

  const t = useCallback(
    (clave, parametros = {}) => {
      const texto = clave
        .split('.')
        .reduce((nodo, parte) => nodo?.[parte], IDIOMAS[idioma])

      return Object.entries(parametros).reduce(
        (resultado, [nombre, valor]) => resultado.replaceAll(`{${nombre}}`, valor),
        texto ?? clave,
      )
    },
    [idioma],
  )

  const cambiarIdioma = useCallback((nuevoIdioma) => {
    if (!IDIOMAS[nuevoIdioma]) {
      return
    }

    localStorage.setItem(CLAVE_IDIOMA, nuevoIdioma)
    setIdioma(nuevoIdioma)
  }, [])

  const valor = useMemo(
    () => ({ idioma, cambiarIdioma, t }),
    [idioma, cambiarIdioma, t],
  )

  return <IdiomaContext.Provider value={valor}>{children}</IdiomaContext.Provider>
}

export default IdiomaProvider