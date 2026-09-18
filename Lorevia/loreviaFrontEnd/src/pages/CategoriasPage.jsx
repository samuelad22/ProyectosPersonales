import { useEffect, useState } from 'react'
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  listarCategorias,
} from '../api/categoriasApi'
import { useIdioma } from '../context/IdiomaContext'
import FormularioCategoria from '../components/FormularioCategoria'
import Modal from '../components/Modal'
import ModalConfirmacion from '../components/ModalConfirmacion'
import TablaParaListar from '../components/TablaParaListar'

function construirColumnas(t) {
  return [
    { clave: 'nombre', titulo: t('categorias.columnaNombre') },
    { clave: 'descripcion', titulo: t('categorias.columnaDescripcion') },
  ]
}

function CategoriasPage() {
  const { t } = useIdioma()
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [categoriaEditando, setCategoriaEditando] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [categoriaEliminando, setCategoriaEliminando] = useState(null)
  const [eliminando, setEliminando] = useState(false)
  const columnas = construirColumnas(t)

  async function cargarCategorias() {
    try {
      const datos = await listarCategorias()
      setCategorias(datos ?? [])
    } catch {
      setError(t('categorias.errorCargar'))
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    listarCategorias()
      .then((datos) => setCategorias(datos ?? []))
      .catch(() => setError(t('categorias.errorCargar')))
      .finally(() => setCargando(false))
  }, [t])

  const abrirCrear = () => {
    setCategoriaEditando(null)
    setModalAbierto(true)
  }

  const abrirEdicion = (categoria) => {
    setCategoriaEditando(categoria)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    if (guardando) {
      return
    }
    setModalAbierto(false)
    setCategoriaEditando(null)
  }

  const manejarGuardar = async (datos) => {
    setGuardando(true)

    try {
      if (categoriaEditando) {
        await actualizarCategoria(categoriaEditando.id, datos)
      } else {
        await crearCategoria(datos)
      }

      setModalAbierto(false)
      setCategoriaEditando(null)
      setError('')
      setCargando(true)
      await cargarCategorias()
    } finally {
      setGuardando(false)
    }
  }

  const confirmarEliminacion = async () => {
    setEliminando(true)

    try {
      await eliminarCategoria(categoriaEliminando.id)
      setCategoriaEliminando(null)
      setError('')
      setCargando(true)
      await cargarCategorias()
    } finally {
      setEliminando(false)
    }
  }

  return (
    <section className="categorias-page">
      <div className="pagina-titulo">
        <h1>{t('categorias.titulo')}</h1>
        <button type="button" className="btn btn-primary" onClick={abrirCrear}>
          {t('categorias.nuevo')}
        </button>
      </div>

      {error && (
        <p className="mensaje-error" role="alert">
          {error}
        </p>
      )}

      {cargando ? (
        <p className="estado-cargando">{t('categorias.cargando')}</p>
      ) : categorias.length === 0 ? (
        <p className="estado-vacio">{t('categorias.vacio')}</p>
      ) : (
        <TablaParaListar
          columnas={columnas}
          filas={categorias}
          alEditar={abrirEdicion}
          alEliminar={setCategoriaEliminando}
        />
      )}

      {modalAbierto && (
        <Modal
          titulo={categoriaEditando ? t('categorias.modalEditar') : t('categorias.modalNuevo')}
          onCerrar={cerrarModal}
        >
          <FormularioCategoria
            categoria={categoriaEditando}
            alGuardar={manejarGuardar}
            alCancelar={cerrarModal}
            cargando={guardando}
          />
        </Modal>
      )}

      {categoriaEliminando && (
        <ModalConfirmacion
          titulo={t('categorias.eliminarTitulo')}
          mensaje={t('categorias.mensajeEliminar', { nombre: categoriaEliminando.nombre })}
          onConfirmar={confirmarEliminacion}
          onCancelar={() => setCategoriaEliminando(null)}
          cargando={eliminando}
        />
      )}
    </section>
  )
}

export default CategoriasPage