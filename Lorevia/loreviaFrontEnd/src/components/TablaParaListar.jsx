import { useIdioma } from '../context/IdiomaContext'

function TablaParaListar({ columnas, filas, alEditar, alEliminar }) {
  const { t } = useIdioma()

  if (columnas.length === 0) {
    return <p className="estado-vacio">{t('tabla.sinRegistros')}</p>
  }

  return (
    <div className="tabla-contenedor">
      <table className="table">
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th key={columna.clave}>{columna.titulo}</th>
            ))}
            <th className="columna-acciones">{t('tabla.acciones')}</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila.id}>
              {columnas.map((columna) => (
                <td key={columna.clave}>{fila[columna.clave]}</td>
              ))}
              <td className="columna-acciones">
                <button type="button" className="btn btn-primary" onClick={() => alEditar(fila)}>
                  {t('comun.editar')}
                </button>
                <button type="button" className="btn btn-danger" onClick={() => alEliminar(fila)}>
                  {t('comun.eliminar')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TablaParaListar