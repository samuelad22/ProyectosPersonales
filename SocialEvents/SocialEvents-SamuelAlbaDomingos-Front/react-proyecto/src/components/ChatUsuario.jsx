import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function ChatUsuario({
  chatId,
  destinatarios,
  cargarChats,
  setNuevoChat,
  setchatSeleccionado,
}) {
  const apiUrlBase = import.meta.env.VITE_API_URL;
  const [mensajesChat, setMensajesChat] = useState(null);
  const [mensajeNuevo, setMensajeNuevo] = useState("");
  const [estadoPeticion, setEstadoPeticion] = useState(false);
  const primeraVez = useRef(true);
  const navigate = useNavigate();

  const cargarMensajes = useCallback(
    (url) => {
      let destinatariosIds = [];
      destinatarios.map((usuario) => {
        destinatariosIds.push(usuario.id);
      });

      fetch(url || apiUrlBase + "/chat/detalle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("usuario"))?.token,
        },
        body: JSON.stringify({
          conversacion_id: chatId,
          destinatarios: destinatariosIds,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setEstadoPeticion(true);
	  marcarLeido();
          if (url) {
            setMensajesChat((prev) => [...data.data, ...prev]);
         requestAnimationFrame(() => {
        document.getElementById("chat-panel").scrollTop =
          document.getElementById("chat-panel").scrollHeight;
      });  
	} else {
            setMensajesChat(data.data);
          }
        });
    },
    [apiUrlBase, chatId, destinatarios],
  );

  const enviarMensaje = () => {
    let destinatariosIds = [
      ...new Set(destinatarios.map((usuario) => usuario.id)),
    ];

    fetch(apiUrlBase + "/enviarMensaje", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
      body: JSON.stringify({
        conversacion_id: chatId,
        contenido: mensajeNuevo,
        destinatarios: destinatariosIds,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setMensajeNuevo("");
        }
        return response.json();
      })
      .then((data) => {
        cargarChats();
        if (!chatId) {
          setNuevoChat(false);
          setchatSeleccionado(data.conversacion_id);
        } else {
          cargarMensajes();
        }
      });
  };

  const marcarLeido = () => {
	if(!chatId) return;
	fetch(apiUrlBase + "/marcarLeido", {
	method: "POST",  
	headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
	body: JSON.stringify({
	conversacion_id: chatId
	}),
	});
}
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("usuario"))) {
      navigate("/login", { replace: true });
      return;
    }
    cargarMensajes();
  }, [chatId]);

  useEffect(() => {
    if (mensajesChat && primeraVez.current) {
      primeraVez.current = false;
      requestAnimationFrame(() => {
        document.getElementById("chat-panel").scrollTop =
          document.getElementById("chat-panel").scrollHeight;
      });
    }
  }, [mensajesChat]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      cargarMensajes();
    }, 3000);

    return () => clearInterval(intervalo);
  }, [chatId]);

  return (
    <div id="chat-usuario-detalle" onScroll={(e) => { if (e.scrollHeight == 0) console.log('hola') }}>
      <div id="chat-panel">
        <div id="miembros-chat">
          {destinatarios
            .filter(
              (u) => u.id !== JSON.parse(localStorage.getItem("usuario")).id,
            )
            .map((usuario) => (
              <div key={usuario.id} className="miembro-chat">
                {usuario.nombreUsuario}
              </div>
            ))}
          {(destinatarios.length == 1 || destinatarios[1]?.id == destinatarios[0]?.id) && (
            <div className="miembro-chat">Tú</div>
          )}
        </div>
 {mensajesChat ? (
          <div id="mensajes-chat">
            {[...mensajesChat].reverse().map((mensaje) => (
              <div
                className={`mensaje ${mensaje.remitenteId == JSON.parse(localStorage.getItem("usuario"))?.id ? "mensaje-propio" : "mensaje-ajeno"}`}
                key={mensaje.id}
              >
                <p className="mensaje-contenido">{mensaje.contenido}</p>
                {new Date(mensaje.fecha) < new Date() ? (
                  <div>
                    <p className="mensaje-hora">{mensaje.fecha}</p>
                    <p className="mensaje-hora">{mensaje.hora}</p>
                  </div>
                ) : (
                  <div>
                    <p className="mensaje-hora">{mensaje.hora}</p>
                  </div>
                )}
                {mensaje.remitenteId ==
                  JSON.parse(localStorage.getItem("usuario"))?.id && (
                  <span className="mensaje-leido">
                    {mensaje.leido ? "✓✓" : "✓"}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : estadoPeticion ? (
          <div id="chats-panel-vacio">No hay mensajes para mostrar</div>
        ) : (
          <div id="spinner-container">
            <div id="spinner"></div>
          </div>
        )}      </div>
      <form
        action=""
        id="enviar-mensaje-chat"
        onSubmit={(e) => {
          e.preventDefault();
          enviarMensaje();
        }}
      >
        <input
          type="text"
          name=""
          value={mensajeNuevo}
          id=""
          placeholder="Enviar mensaje..."
          onChange={(e) => {
            setMensajeNuevo(e.target.value);
          }}
        />
      </form>
    </div>
  );
}

export default ChatUsuario;
