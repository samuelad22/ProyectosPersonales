import { useEffect, useState } from 'react'
import { listarLibros } from '../api/librosApi'
import { useIdioma } from '../context/IdiomaContext'
import SeleccionMultiple from './SeleccionMultiple'

function FormularioPersonaje({ personaje, alGuardar, alCancelar, cargando }) {
  const { t } = useIdioma()
  const [nombre, setNombre] = useState(personaje?.nombre ?? '')
  const [lugarOrigen, setLugarOrigen] = useState(personaje?.informacionPersonaje?.lugarOrigen ?? '')
  const [fechaNacimiento, setFechaNacimiento] = useState(
    personaje?.informacionPersonaje?.fechaNacimiento ?? '',
  )
  const [fechaMuerte, setFechaMuerte] = useState(personaje?.informacionPersonaje?.fechaMuerte ?? '')
  const [libros, setLibros] = useState([])
  const [librosIds, setLibrosIds] = useState(() => personaje?.libros?.map((libro) => libro.id) ?? [])
  const [cargandoOpciones, setCargandoOpciones] = useState(true)
  const [errorOpciones, setErrorOpciones] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    listarLibros()
      .then((datos) => setLibros(datos ?? []))
      .catch(() => setErrorOpciones(t('formularioPersonaje.errorOpciones')))
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
        lugarOrigen: lugarOrigen.trim(),
        fechaNacimiento: fechaNacimiento || null,
        fechaMuerte: fechaMuerte || null,
        librosIds,
      })
    } catch {
      setError(t('formularioPersonaje.errorGuardar'))
    }
  }

  return (
    <form className="form" onSubmit={manejarEnvio} noValidate>
      <div className="form-campo">
        <label className="form-label" htmlFor="personaje-nombre">
          {t('comun.nombre')}
        </label>
        <input
          id="personaje-nombre"
          className="form-input"
          type="text"
          value={nombre}
          onChange={(evento) => setNombre(evento.target.value)}
          placeholder={t('formularioPersonaje.placeholderNombre')}
          autoComplete="off"
          required
        />
      </div>
      <div className="form-campo">
        <label className="form-label" htmlFor="personaje-lugar-origen">
          {t('formularioPersonaje.lugarOrigen')}
        </label>
        <input
          id="personaje-lugar-origen"
          className="form-input"
          type="text"
          value={lugarOrigen}
          onChange={(evento) => setLugarOrigen(evento.target.value)}
          placeholder={t('formularioPersonaje.placeholderLugarOrigen')}
          autoComplete="off"
        />
      </div>
      <div className="form-campo">
        <label className="form-label" htmlFor="personaje-fecha-nacimiento">
          {t('formularioPersonaje.fechaNacimiento')}
        </label>
        <input
          id="personaje-fecha-nacimiento"
          className="form-input"
          type="date"
          value={fechaNacimiento}
          onChange={(evento) => setFechaNacimiento(evento.target.value)}
        />
      </div>
      <div className="form-campo">
        <label className="form-label" htmlFor="personaje-fecha-muerte">
          {t('formularioPersonaje.fechaMuerte')}
        </label>
        <input
          id="personaje-fecha-muerte"
          className="form-input"
          type="date"
          value={fechaMuerte}
          onChange={(evento) => setFechaMuerte(evento.target.value)}
        />
      </div>

      {cargandoOpciones ? (
        <p className="estado-cargando">{t('formularios.cargandoOpciones')}</p>
      ) : errorOpciones ? (
        <p className="mensaje-error" role="alert">
          {errorOpciones}
        </p>
      ) : (
        <div className="form-campo">
          <span className="form-label">{t('formularioPersonaje.libros')}</span>
          <SeleccionMultiple opciones={libros} seleccionadas={librosIds} alCambiar={setLibrosIds} />
        </div>
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

export default FormularioPersonaje