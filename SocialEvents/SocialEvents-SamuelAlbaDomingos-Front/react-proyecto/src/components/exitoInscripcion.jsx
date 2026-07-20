import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCalendarDays, faLocationDot, faArrowLeft, faTicket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function InscripcionExito() {
  const navigate = useNavigate();
  const { id } = useParams();
  const obtenerEventoUrl = import.meta.env.VITE_API_URL + "/eventos/detalle/" + id;
  const [evento, setEvento] = useState(null);

useEffect(()=> {
    fetch(obtenerEventoUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => setEvento(data.data))
}, [])

  return (
    <div id="inscripcion-exito">

      <div className="exito-card">

        <div className="exito-icono-wrapper">
          <div className="exito-icono-ring" />
          <div className="exito-icono">
            <FontAwesomeIcon icon={faCircleCheck} />
          </div>
        </div>

        <h1 className="exito-titulo">¡Inscripción confirmada!</h1>
        <p className="exito-subtitulo">
          Tu plaza está reservada. Te esperamos en el evento.
        </p>

        <div className="exito-detalles">
          <div className="exito-detalle-fila">
            <span className="exito-detalle-icono">
              <FontAwesomeIcon icon={faTicket} />
            </span>
            <span className="exito-detalle-label">Evento</span>
            <span className="exito-detalle-valor">{evento?.nombre}</span>
          </div>

          <div className="exito-detalle-fila">
            <span className="exito-detalle-icono">
              <FontAwesomeIcon icon={faCalendarDays} />
            </span>
            <span className="exito-detalle-label">Fecha</span>
            <span className="exito-detalle-valor">{evento?.fechaInicio}</span>
          </div>

          <div className="exito-detalle-fila">
            <span className="exito-detalle-icono">
              <FontAwesomeIcon icon={faLocationDot} />
            </span>
            <span className="exito-detalle-label">Ubicación</span>
            <span className="exito-detalle-valor">{evento?.ubicacion}</span>
          </div>

        </div>

        <p className="exito-email-nota">
          Recibirás un email de confirmación con todos los detalles.
        </p>

        <div className="exito-acciones">
          <button className="exito-btn-secundario" onClick={() => navigate("/", { replace: true })}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Volver al inicio
          </button>
          <button className="exito-btn-principal" onClick={() => navigate("/eventos", { replace: true })}>
            Ver más eventos
          </button>
        </div>

      </div>

    </div>
  );
}

export default InscripcionExito;