import { useIdioma } from '../context/IdiomaContext'

function Modal({ titulo, onCerrar, children }) {
  const { t } = useIdioma()

  return (
    <div className="modal-overlay" onClick={onCerrar} role="presentation">
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-titulo" id="modal-titulo">
            {titulo}
          </h2>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCerrar}
            aria-label={t('modal.cerrar')}
          >
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export default Modal