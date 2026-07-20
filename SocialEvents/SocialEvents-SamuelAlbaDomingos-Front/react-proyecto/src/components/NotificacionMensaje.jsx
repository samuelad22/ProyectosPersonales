import { useEffect } from "react";

function NotificacionMensaje({mensaje, onClose}) {

  useEffect(() => {
     if (!mensaje) return ;
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

 if (!mensaje) return null;
  return (
     <div className="toast-mensaje" onClick={onClose}>
      <p className="toast-usuario">{mensaje.nombreUsuarioRemitente}</p>
      <p className="toast-texto">{mensaje.contenido}</p>
    </div>
  );
}
export default NotificacionMensaje