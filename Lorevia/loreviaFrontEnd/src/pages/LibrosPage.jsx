import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { actualizarLibro, crearLibro, eliminarLibro, listarLibros } from '../api/librosApi'
import { useIdioma } from '../context/IdiomaContext'
import FormularioLibro from '../components/FormularioLibro'
import Modal from '../components/Modal'
import ModalConfirmacion from '../components/ModalConfirmacion'

function LibrosPage() {
  const { t } = useIdioma()
  const [libros, setLibros] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [libroEditando, setLibroEditando] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [libroEliminando, setLibroEliminando] = useState(null)
  const [eliminando, setEliminando] = useState(false)

  async function cargarLibros() {
    try {
      const datos = await listarLibros()
      setLibros(datos ?? [])
    } catch {
      setError(t('libros.errorCargar'))
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    listarLibros()
      .then((datos) => setLibros(datos ?? []))
      .catch(() => setError(t('libros.errorCargar')))
      .finally(() => setCargando(false))
  }, [t])

  const abrirCrear = () => {
    setLibroEditando(null)
    setModalAbierto(true)
  }

  const abrirEdicion = (libro) => {
    setLibroEditando(libro)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    if (guardando) {
      return
    }
    setModalAbierto(false)
    setLibroEditando(null)
  }

  const manejarGuardar = async (datos) => {
    setGuardando(true)

    try {
      if (libroEditando) {
        await actualizarLibro(libroEditando.id, datos)
      } else {
        await crearLibro(datos)
      }

      setModalAbierto(false)
      setLibroEditando(null)
      setError('')
      setCargando(true)
      await cargarLibros()
    } finally {
      setGuardando(false)
    }
  }

  const confirmarEliminacion = async () => {
    setEliminando(true)

    try {
      await eliminarLibro(libroEliminando.id)
      setLibroEliminando(null)
      setError('')
      setCargando(true)
      await cargarLibros()
    } finally {
      setEliminando(false)
    }
  }

  return (
    <section className="libros-page">
      <div className="pagina-titulo">
        <h1>{t('libros.titulo')}</h1>
        <button type="button" className="btn btn-primary" onClick={abrirCrear}>
          {t('libros.nuevo')}
        </button>
      </div>

      {error && (
        <p className="mensaje-error" role="alert">
          {error}
        </p>
      )}

      {cargando ? (
        <p className="estado-cargando">{t('libros.cargando')}</p>
      ) : libros.length === 0 ? (
        <p className="estado-vacio">{t('libros.vacio')}</p>
      ) : (
        <div className="grid-libros">
          {libros.map((libro) => (
            <article className="libro-card" key={libro.id}>
              <h2 className="libro-card-titulo">{libro.nombre}</h2>
              <p className="libro-card-sinopsis">{libro.sinopsis}</p>
              <div className="libro-card-acciones">
                <Link className="btn btn-ghost" to={`/libros/${libro.id}`}>
                  {t('libros.verDetalle')}
                </Link>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => abrirEdicion(libro)}
                >
                  {t('comun.editar')}
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setLibroEliminando(libro)}
                >
                  {t('comun.eliminar')}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {modalAbierto && (
        <Modal titulo={libroEditando ? t('libros.modalEditar') : t('libros.modalNuevo')} onCerrar={cerrarModal}>
          <FormularioLibro
            libro={libroEditando}
            alGuardar={manejarGuardar}
            alCancelar={cerrarModal}
            cargando={guardando}
          />
        </Modal>
      )}

      {libroEliminando && (
        <ModalConfirmacion
          titulo={t('libros.eliminarTitulo')}
          mensaje={t('libros.mensajeEliminar', { nombre: libroEliminando.nombre })}
          onConfirmar={confirmarEliminacion}
          onCancelar={() => setLibroEliminando(null)}
          cargando={eliminando}
        />
      )}
    </section>
  )
}

export default LibrosPage