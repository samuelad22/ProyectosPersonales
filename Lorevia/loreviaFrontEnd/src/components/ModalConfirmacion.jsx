import { useIdioma } from '../context/IdiomaContext'
import Modal from './Modal'

function ModalConfirmacion({ titulo, mensaje, onConfirmar, onCancelar, cargando }) {
  const { t } = useIdioma()

  return (
    <Modal titulo={titulo} onCerrar={onCancelar}>
      <p className="modal-mensaje">{mensaje}</p>
      <div className="form-acciones">
        <button type="button" className="btn btn-ghost" onClick={onCancelar} disabled={cargando}>
          {t('comun.cancelar')}
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={onConfirmar}
          disabled={cargando}
        >
          {cargando ? t('comun.eliminando') : t('comun.eliminar')}
        </button>
      </div>
    </Modal>
  )
}

export default ModalConfirmacion