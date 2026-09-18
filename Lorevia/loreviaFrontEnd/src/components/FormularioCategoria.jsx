import { useState } from 'react'
import { useIdioma } from '../context/IdiomaContext'

function FormularioCategoria({ categoria, alGuardar, alCancelar, cargando }) {
  const { t } = useIdioma()
  const [nombre, setNombre] = useState(categoria?.nombre ?? '')
  const [descripcion, setDescripcion] = useState(categoria?.descripcion ?? '')
  const [error, setError] = useState('')

  const manejarEnvio = async (evento) => {
    evento.preventDefault()

    if (!nombre.trim()) {
      setError(t('formularios.errorNombreObligatorio'))
      return
    }

    setError('')

    try {
      await alGuardar({ nombre: nombre.trim(), descripcion: descripcion.trim() })
    } catch {
      setError(t('formularioCategoria.errorGuardar'))
    }
  }

  return (
    <form className="form" onSubmit={manejarEnvio} noValidate>
      <div className="form-campo">
        <label className="form-label" htmlFor="categoria-nombre">
          {t('comun.nombre')}
        </label>
        <input
          id="categoria-nombre"
          className="form-input"
          type="text"
          value={nombre}
          onChange={(evento) => setNombre(evento.target.value)}
          placeholder={t('formularioCategoria.placeholderNombre')}
          autoComplete="off"
          required
        />
      </div>
      <div className="form-campo">
        <label className="form-label" htmlFor="categoria-descripcion">
          {t('comun.descripcion')}
        </label>
        <textarea
          id="categoria-descripcion"
          className="form-textarea"
          value={descripcion}
          onChange={(evento) => setDescripcion(evento.target.value)}
          placeholder={t('formularioCategoria.placeholderDescripcion')}
        />
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="form-acciones">
        <button type="button" className="btn btn-ghost" onClick={alCancelar} disabled={cargando}>
          {t('comun.cancelar')}
        </button>
        <button type="submit" className="btn btn-primary" disabled={cargando}>
          {cargando ? t('comun.guardando') : t('comun.guardar')}
        </button>
      </div>
    </form>
  )
}

export default FormularioCategoria