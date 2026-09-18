import { useEffect, useState } from 'react'
import {
  actualizarPersonaje,
  crearPersonaje,
  eliminarPersonaje,
  listarPersonajes,
} from '../api/personajesApi'
import { useIdioma } from '../context/IdiomaContext'
import FormularioPersonaje from '../components/FormularioPersonaje'
import Modal from '../components/Modal'
import ModalConfirmacion from '../components/ModalConfirmacion'
import TablaParaListar from '../components/TablaParaListar'

function construirColumnas(t) {
  return [
    { clave: 'nombre', titulo: t('personajes.columnaNombre') },
    { clave: 'lugarOrigen', titulo: t('personajes.columnaLugarOrigen') },
    { clave: 'fechaNacimiento', titulo: t('personajes.columnaFechaNacimiento') },
    { clave: 'fechaMuerte', titulo: t('personajes.columnaFechaMuerte') },
    { clave: 'numeroLibros', titulo: t('personajes.columnaLibros') },
  ]
}

function PersonajesPage() {
  const { t } = useIdioma()
  const [personajes, setPersonajes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [personajeEditando, setPersonajeEditando] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [personajeEliminando, setPersonajeEliminando] = useState(null)
  const [eliminando, setEliminando] = useState(false)
  const columnas = construirColumnas(t)

  async function cargarPersonajes() {
    try {
      const datos = await listarPersonajes()
      setPersonajes(datos ?? [])
    } catch {
      setError(t('personajes.errorCargar'))
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    listarPersonajes()
      .then((datos) => setPersonajes(datos ?? []))
      .catch(() => setError(t('personajes.errorCargar')))
      .finally(() => setCargando(false))
  }, [t])

  const abrirCrear = () => {
    setPersonajeEditando(null)
    setModalAbierto(true)
  }

  const abrirEdicion = (personaje) => {
    setPersonajeEditando(personaje)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    if (guardando) {
      return
    }
    setModalAbierto(false)
    setPersonajeEditando(null)
  }

  const manejarGuardar = async (datos) => {
    setGuardando(true)

    try {
      if (personajeEditando) {
        await actualizarPersonaje(personajeEditando.id, datos)
      } else {
        await crearPersonaje(datos)
      }

      setModalAbierto(false)
      setPersonajeEditando(null)
      setError('')
      setCargando(true)
      await cargarPersonajes()
    } finally {
      setGuardando(false)
    }
  }

  const confirmarEliminacion = async () => {
    setEliminando(true)

    try {
      await eliminarPersonaje(personajeEliminando.id)
      setPersonajeEliminando(null)
      setError('')
      setCargando(true)
      await cargarPersonajes()
    } finally {
      setEliminando(false)
    }
  }

  const filas = personajes.map((personaje) => ({
    id: personaje.id,
    nombre: personaje.nombre,
    lugarOrigen: personaje.informacionPersonaje?.lugarOrigen ?? t('personajes.sinEspecificar'),
    fechaNacimiento: personaje.informacionPersonaje?.fechaNacimiento ?? t('personajes.sinEspecificar'),
    fechaMuerte: personaje.informacionPersonaje?.fechaMuerte ?? t('personajes.sinEspecificar'),
    numeroLibros: personaje.libros?.length ?? 0,
  }))

  return (
    <section className="personajes-page">
      <div className="pagina-titulo">
        <h1>{t('personajes.titulo')}</h1>
        <button type="button" className="btn btn-primary" onClick={abrirCrear}>
          {t('personajes.nuevo')}
        </button>
      </div>

      {error && (
        <p className="mensaje-error" role="alert">
          {error}
        </p>
      )}

      {cargando ? (
        <p className="estado-cargando">{t('personajes.cargando')}</p>
      ) : personajes.length === 0 ? (
        <p className="estado-vacio">{t('personajes.vacio')}</p>
      ) : (
        <TablaParaListar
          columnas={columnas}
          filas={filas}
          alEditar={abrirEdicion}
          alEliminar={setPersonajeEliminando}
        />
      )}

      {modalAbierto && (
        <Modal
          titulo={personajeEditando ? t('personajes.modalEditar') : t('personajes.modalNuevo')}
          onCerrar={cerrarModal}
        >
          <FormularioPersonaje
            personaje={personajeEditando}
            alGuardar={manejarGuardar}
            alCancelar={cerrarModal}
            cargando={guardando}
          />
        </Modal>
      )}

      {personajeEliminando && (
        <ModalConfirmacion
          titulo={t('personajes.eliminarTitulo')}
          mensaje={t('personajes.mensajeEliminar', { nombre: personajeEliminando.nombre })}
          onConfirmar={confirmarEliminacion}
          onCancelar={() => setPersonajeEliminando(null)}
          cargando={eliminando}
        />
      )}
    </section>
  )
}

export default PersonajesPage