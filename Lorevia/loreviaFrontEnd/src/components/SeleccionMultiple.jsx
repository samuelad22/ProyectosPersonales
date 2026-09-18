import { useIdioma } from '../context/IdiomaContext'

function SeleccionMultiple({ opciones, seleccionadas, alCambiar }) {
  const { t } = useIdioma()

  const alternar = (id) => {
    const nuevas = seleccionadas.includes(id)
      ? seleccionadas.filter((actual) => actual !== id)
      : [...seleccionadas, id]
    alCambiar(nuevas)
  }

  if (opciones.length === 0) {
    return <p className="estado-vacio seleccion-vacio">{t('seleccionMultiple.sinOpciones')}</p>
  }

  return (
    <div className="seleccion-multiple">
      {opciones.map((opcion) => (
        <label className="seleccion-multiple-opcion" key={opcion.id}>
          <input
            type="checkbox"
            checked={seleccionadas.includes(opcion.id)}
            onChange={() => alternar(opcion.id)}
          />
          <span>{opcion.nombre}</span>
        </label>
      ))}
    </div>
  )
}

export default SeleccionMultiple