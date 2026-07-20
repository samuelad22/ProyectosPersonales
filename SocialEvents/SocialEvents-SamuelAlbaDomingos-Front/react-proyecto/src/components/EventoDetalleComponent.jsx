import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./NavBar";
import Mapa from "./Mapa";
import FormularioCrearEvento from "./FormularioCrearEvento";
import { useComprobarVeto } from "./useComprobarVeto";

function EventoDetalle() {
  useComprobarVeto();

  const { id } = useParams();
  const [valoracion, setValoracion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [hover, setHover] = useState(0);
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);
  const [mensajeErrorVeto, setMensajeErrorVeto] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [evento, setEvento] = useState(null);

  const cargarEvento = () => {
    fetch(apiUrl + "/eventos/detalle/" + id)
      .then((response) => response.json())
      .then((data) => setEvento(data.data));
  };
  useEffect(() => {
    cargarEvento();
    if (localStorage.getItem("usuario")) {
      fetch(apiUrl + "/valoracion/consultar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
        },
        body: JSON.stringify({
          evento_id: parseInt(id),
        }),
      })
        .then((response) => response.json())
        .then((data) => setValoracion(data.puntuacion));
    }
  }, [id]);

  if (!evento) {
    return <div className="cargando">Cargando...</div>;
  }

  const valorarEvento = (puntuacion, contenido) => {
    const body = {};
    if (puntuacion && puntuacion > 0) body.puntuacion = parseInt(puntuacion);
    if (contenido) body.contenido = contenido;

    fetch(apiUrl + "/valorar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
      body: JSON.stringify({
        evento_id: parseInt(id),
        ...body,
      }),
    }).then((response) => {
      if (response.ok && comentario) {
        fetch(apiUrl + "/eventos/detalle/" + id)
          .then((response) => response.json())
          .then((data) => setEvento(data.data));
        document.getElementById("mensaje-publicar-comentario").innerText =
          "Comentario publicado con exito";
        document
          .getElementById("mensaje-publicar-comentario")
          .classList.remove("hidden");
      } else if (response.status == 403) {
        setConfirmarBorrado(false);
        setMensajeErrorVeto(
          "No se puede interactuar con este evento debido a su sancion",
        );
        setComentario("");
      } else if (puntuacion) {
        return;
      } else {
        document.getElementById("mensaje-publicar-comentario").innerText =
          "Error al publicar el comentario.";
        document
          .getElementById("mensaje-publicar-comentario")
          .classList.remove("hidden");
      }
    });
  };
  const borrarEvento = () => {
    fetch(apiUrl + "/eventos/borrar", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("usuario")).token}`,
      },
      body: JSON.stringify({
        evento_id: evento.id,
      }),
    }).then((response) => {
      if (response.ok) {
        navigate("/");
      } else if (response.status == 403) {
        setConfirmarBorrado(false);
        setMensajeErrorVeto(
          "No se puede interactuar con este evento debido a su sancion",
        );
      }
    });
  };
  const borrarComentario = (comentarioId) => {
    fetch(apiUrl + "/valoracion/borrarComentario", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("usuario")).token}`,
      },
      body: JSON.stringify({
        comentario_id: comentarioId,
      }),
    }).then(() => {
      cargarEvento();
      setConfirmarBorrado(false);
    });
  };
  return (
    <div>
      <Navbar />
      <div id="evento-detalle">
        <div id="evento-detalle-imagen">
          <img src={evento.imagen} alt={evento.nombre} />
        </div>

        <div id="evento-detalle-info">
          <span
            id="evento-detalle-categoria"
            className={evento.categoria.color}
          >
            {evento.categoria.nombre}
          </span>
          <h2 id="evento-detalle-titulo">{evento.nombre}</h2>
          <p id="evento-detalle-descripcion">{evento.descripcion}</p>

          <div id="evento-detalle-datos">
            <div className="evento-detalle-dato">
              <span className="dato-label"> Ubicación</span>
              <span className="dato-valor">{evento.ubicacion}</span>
            </div>
            <div className="evento-detalle-dato">
              <span className="dato-label"> Inicio</span>
              <span className="dato-valor">
                {evento.fechaInicio} - {evento.horaInicio}
              </span>
            </div>
            <div className="evento-detalle-dato">
              <span className="dato-label"> Fin</span>
              <span className="dato-valor">
                {evento.fechaFin ? evento.fechaFin + " -" : "No especificada"}  {evento.horaFin ? evento.horaFin : "No especificada"}
              </span>
            </div>
            <div className="evento-detalle-dato">
              <span className="dato-label"> Aforo disponible</span>
              <span className="dato-valor">
                {evento.aforoMaximo - evento.aforoActual}/{evento.aforoMaximo}
              </span>
            </div>
            <div className="evento-detalle-dato">
              <span className="dato-label"> Creador</span>
              <span className="dato-valor">{evento.creador}</span>
            </div>

		{evento.precio && evento.precio > 0 ?  <div className="evento-detalle-dato">
              <span className="dato-label"> Precio por cabeza</span>
              <span className="dato-valor">{evento.precio.replace(".", ",")} €</span>
</div> : <div className="evento-detalle-dato">
              <span className="dato-label"> Precio por cabeza</span>
              <span className="dato-valor">Gratis</span>
</div>}
		
            <div id="etiquetas">
              {evento.tags.map((tag) => (
                <span className="etiqueta-busqueda" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            {new Date(evento.fechaInicio) < new Date() ? (
              <div className="valoracion-puntaje">
                <p><FontAwesomeIcon icon={faUsers} /> Valoracion popular: 
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    className={
                      i <= evento.puntuacionMedia
                        ? "estrella estrella-llena-popular"
                        : "estrella estrella-vacia"
                    }
                  >
                    ★
                  </button>
                ))}</p>
                <p> <FontAwesomeIcon icon={faUser} /> Tu valoracion:
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    value={i}
                    key={i}
                    onClick={() => {
                      setValoracion(i);
                      valorarEvento(i, comentario);
                    }}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(0)}
                    className={
                      i <= (hover || valoracion)
                        ? "estrella estrella-llena-propia"
                        : "estrella estrella-vacia"
                    }
                  >
                    ★
                  </button>
                ))}</p>
              </div>
            ) : (
              <div>
                {mensajeErrorVeto && mensajeErrorVeto}
                <div className="botones">
                  <button
                    id="btn-inscripcion"
                    onClick={() => {
                      navigate("/inscripcion/" + evento.id);
                    }}
                  >
                    Inscripcion
                  </button>
                  {(evento.creador ==
                    JSON.parse(localStorage.getItem("usuario"))
                      ?.nombreUsuario || JSON.parse(localStorage.getItem("usuario"))?.rol == "admin")  && (
                    <button
                      id="btn-borrar"
                      onClick={() => {
                        setConfirmarBorrado(true);
                      }}
                    >
                      Borrar
                    </button>
                  )}
                  {(evento.creador ==
                    JSON.parse(localStorage.getItem("usuario"))
                      ?.nombreUsuario || JSON.parse(localStorage.getItem("usuario"))?.rol == "admin") && (
                    <button
                      id="btn-editar"
                      onClick={() => {
                        navigate("/editarEvento", { state: { evento } });
                      }}
                    >
                      Editar
                    </button>
                  )}
                </div>
              </div>
            )}
            {confirmarBorrado && (
              <div
                id="modal-overlay"
                onClick={() => setConfirmarBorrado(false)}
              >
                <div
                  id="modal"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <p>¿Seguro que quieres borrar el evento?</p>
                  <div id="modal-botones">
                    <button id="btn-confirmar-borrar" onClick={borrarEvento}>
                      Sí, borrar
                    </button>
                    <button
                      id="btn-cancelar-borrar"
                      onClick={() => setConfirmarBorrado(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
            {mensajeErrorVeto && (
              <div
                id="modal-overlay"
                onClick={() => setMensajeErrorVeto(false)}
              >
                <div
                  id="modal"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <p>
                    Debido a su sancion no puede interactuar con este evento
                  </p>
                  <div id="modal-botones">
                    <button
                      id="btn-cancelar-borrar"
                      onClick={() => setMensajeErrorVeto(false)}
                    >
                      Aceptar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div id="map-wrapper">
        <Mapa ubicacion={evento.ubicacion}></Mapa>
      </div>

      <div id="seccion-comentarios">
        <h3>
          <FontAwesomeIcon icon={faComment} /> Comentarios
        </h3>
        {evento.comentarios
          .filter((comentario) => comentario.contenido)
          .map((comentario, index) => (
            <div key={index} className="comentario-evento">
              <div className="comentario-header">
                <span className="comentario-usuario">
                  <FontAwesomeIcon icon={faUser} /> {comentario.usuario}
                </span>
                <span className="comentario-fecha">
                  <FontAwesomeIcon icon={faCalendar} /> {comentario.fecha}
                </span>
                {comentario.creador_id ==
                  JSON.parse(localStorage.getItem("usuario")).id ||
                JSON.parse(localStorage.getItem("usuario")).rol == "admin" ? (
                  <button
                    className="btn-borrar-comentario"
                    onClick={() => borrarComentario(comentario.id)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                ) : null}
              </div>
              <p className="comentario-contenido">{comentario.contenido}</p>
            </div>
          ))}
        <div id="mensaje">
          <p id="mensaje-publicar-comentario" className="hidden"></p>
        </div>
        <div id="comentario_nuevo">
          <form
            action=""
            onSubmit={(e) => {
              e.preventDefault();
              valorarEvento(null, comentario);
            }}
          >
            <input
              type="text"
              name=""
              id=""
              placeholder="Escribe tu comentario..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
            <input type="submit" value="Publicar" />
          </form>
        </div>
      </div>
    </div>
  );
}
export default EventoDetalle;
