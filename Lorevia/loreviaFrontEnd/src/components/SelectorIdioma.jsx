import { useIdioma } from '../context/IdiomaContext'

function SelectorIdioma() {
  const { idioma, cambiarIdioma, t } = useIdioma()

  return (
    <select
      className="selector-idioma"
      aria-label={t('idioma.etiqueta')}
      value={idioma}
      onChange={(evento) => cambiarIdioma(evento.target.value)}
    >
      <option value="es" lang="es">
        {t('idioma.espanol')}
      </option>
      <option value="en" lang="en">
        {t('idioma.ingles')}
      </option>
    </select>
  )
}

export default SelectorIdioma