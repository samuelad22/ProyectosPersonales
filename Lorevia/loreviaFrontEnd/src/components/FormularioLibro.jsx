import { useEffect, useState } from 'react'
import { listarCategorias } from '../api/categoriasApi'
import { listarPersonajes } from '../api/personajesApi'
import { useIdioma } from '../context/IdiomaContext'
import SeleccionMultiple from './SeleccionMultiple'

function FormularioLibro({ libro, alGuardar, alCancelar, cargando }) {
  const { t } = useIdioma()
  const [nombre, setNombre] = useState(libro?.nombre ?? '')
  const [sinopsis, setSinopsis] = useState(libro?.sinopsis ?? '')
  const [categorias, setCategorias] = useState([])
  const [personajes, setPersonajes] = useState([])
  const [categoriasIds, setCategoriasIds] = useState(() => libro?.categorias?.map((c) => c.id) ?? [])
  const [personajesIds, setPersonajesIds] = useState(() => libro?.personajes?.map((p) => p.id) ?? [])
  const [cargandoOpciones, setCargandoOpciones] = useState(true)
  const [errorOpciones, setErrorOpciones] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([listarCategorias(), listarPersonajes()])
      .then(([datosCategorias, datosPersonajes]) => {
        setCategorias(datosCategorias ?? [])
        setPersonajes(datosPersonajes ?? [])
      })
      .catch(() => setErrorOpciones(t('formularioLibro.errorOpciones')))
      .finally(() => setCargandoOpciones(false))
  }, [t])

  const manejarEnvio = async (evento) => {
    evento.preventDefault()

    if (!nombre.trim()) {
      setError(t('formularios.errorNombreObligatorio'))
      return
    }

    setError('')

    try {
      await alGuardar({
        nombre: nombre.trim(),
        sinopsis: sinopsis.trim(),
        categoriasIds,
        personajesIds,
      })
    } catch {
      setError(t('formularioLibro.errorGuardar'))
    }
  }

  return (
    <form className="form" onSubmit={manejarEnvio} noValidate>
      <div className="form-campo">
        <label className="form-label" htmlFor="libro-nombre">
          {t('comun.nombre')}
        </label>
        <input
          id="libro-nombre"
          className="form-input"
          type="text"
          value={nombre}
          onChange={(evento) => setNombre(evento.target.value)}
          placeholder={t('formularioLibro.placeholderNombre')}
          autoComplete="off"
          required
        />
      </div>
      <div className="form-campo">
        <label className="form-label" htmlFor="libro-sinopsis">
          {t('formularioLibro.sinopsis')}
        </label>
        <textarea
          id="libro-sinopsis"
          className="form-textarea"
          value={sinopsis}
          onChange={(evento) => setSinopsis(evento.target.value)}
          placeholder={t('formularioLibro.placeholderSinopsis')}
        />
      </div>

      {cargandoOpciones ? (
        <p className="estado-cargando">{t('formularios.cargandoOpciones')}</p>
      ) : errorOpciones ? (
        <p className="mensaje-error" role="alert">
          {errorOpciones}
        </p>
      ) : (
        <>
          <div className="form-campo">
            <span className="form-label">{t('formularioLibro.categorias')}</span>
            <SeleccionMultiple
              opciones={categorias}
              seleccionadas={categoriasIds}
              alCambiar={setCategoriasIds}
            />
          </div>
          <div className="form-campo">
            <span className="form-label">{t('formularioLibro.personajes')}</span>
            <SeleccionMultiple
              opciones={personajes}
              seleccionadas={personajesIds}
              alCambiar={setPersonajesIds}
            />
          </div>
        </>
      )}

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

export default FormularioLibro