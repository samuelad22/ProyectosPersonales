import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { obtenerLibro } from '../api/librosApi'
import { useIdioma } from '../context/IdiomaContext'

function LibroDetallePage() {
  const { id } = useParams()
  const { t } = useIdioma()
  const [libro, setLibro] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    obtenerLibro(id)
      .then(setLibro)
      .catch(() => setError(t('libroDetalle.errorCargar')))
      .finally(() => setCargando(false))
  }, [id, t])

  if (cargando) {
    return <p className="estado-cargando">{t('libroDetalle.cargando')}</p>
  }

  if (error) {
    return (
      <>
        <p className="mensaje-error" role="alert">
          {error}
        </p>
        <Link className="btn btn-ghost" to="/libros">
          {t('libroDetalle.volver')}
        </Link>
      </>
    )
  }

  if (!libro) {
    return (
      <>
        <p className="estado-vacio">{t('libroDetalle.noEncontrado')}</p>
        <Link className="btn btn-ghost" to="/libros">
          {t('libroDetalle.volver')}
        </Link>
      </>
    )
  }

  return (
    <section className="detalle-libro-page">
      <Link className="btn btn-ghost detalle-volver" to="/libros">
        {t('libroDetalle.volver')}
      </Link>
      <article className="detalle-libro">
        <header className="detalle-libro-cabecera">
          <h1 className="detalle-libro-titulo">{libro.nombre}</h1>
          {libro.autor && (
            <p className="detalle-libro-autor">{t('libroDetalle.autor', { autor: libro.autor })}</p>
          )}
        </header>
        <section className="detalle-libro-seccion">
          <h2 className="detalle-libro-subtitulo">{t('libroDetalle.sinopsis')}</h2>
          <p className="detalle-libro-sinopsis">{libro.sinopsis || t('libroDetalle.sinSinopsis')}</p>
        </section>
        <section className="detalle-libro-seccion">
          <h2 className="detalle-libro-subtitulo">{t('libroDetalle.categorias')}</h2>
          {libro.categorias?.length ? (
            <ul className="lista-chip">
              {libro.categorias.map((categoria) => (
                <li className="chip" key={categoria.id}>
                  {categoria.nombre}
                </li>
              ))}
            </ul>
          ) : (
            <p className="detalle-libro-vacio">{t('libroDetalle.sinCategorias')}</p>
          )}
        </section>
        <section className="detalle-libro-seccion">
          <h2 className="detalle-libro-subtitulo">{t('libroDetalle.personajes')}</h2>
          {libro.personajes?.length ? (
            <ul className="lista-detalle">
              {libro.personajes.map((personaje) => (
                <li className="lista-detalle-item" key={personaje.id}>
                  {personaje.nombre}
                </li>
              ))}
            </ul>
          ) : (
            <p className="detalle-libro-vacio">{t('libroDetalle.sinPersonajes')}</p>
          )}
        </section>
      </article>
    </section>
  )
}

export default LibroDetallePage