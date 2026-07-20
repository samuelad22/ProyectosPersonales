import { useCallback, useEffect, useRef, useState } from "react";
import ChatUsuario from "./ChatUsuario";
import NavBar from "./NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useComprobarVeto } from "./useComprobarVeto";

function ListarChatsUsuarios() {
  const apiUrlBase = import.meta.env.VITE_API_URL;
  const [chats, setChats] = useState([]);
  const [usuarios, setUsuarios] = useState([]); //Resutlado de los usuarios encontrados al busca en el input, almacena el objeto completo
  const [chatSeleccionado, setchatSeleccionado] = useState(null);
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]); //Lista de usuarios seleccionados para una conversacion, almacena lista de ids
  const [nuevoChat, setNuevoChat] = useState(false);
  const [modalListaUsuarios, setModalListaUsuarios] = useState(false);
  const [usuarioBuscado, setUsuarioBuscado] = useState(""); //Usuario buscado en el input, almacena string
  const debounceTimer = useRef(null);

  useComprobarVeto();

  const buscarPorNombre = (nombre) => {

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetch(apiUrlBase + "/usuarios/buscarPorNombre", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
        },
        body: JSON.stringify({ nombreUsuario: nombre }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (nombre.length == 0) {
            setUsuarios([]);
          } else {
            setUsuarios(data.data);
          }
        });
    }, 500);
  };
  const cargarChats = useCallback(() => {
    fetch(apiUrlBase + "/chats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario"))?.token,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setChats(data.data);
      });
  }, [apiUrlBase]);
  useEffect(() => {
    cargarChats();
  }, [apiUrlBase]);


  return (
    <div id="chats-page">
      <NavBar />
      <div id="chats-layout">
        <div id="chats-sidebar">
          <div id="chats-buscador">
            <input
              type="text"
              name=""
              id=""
              placeholder="Buscar usuario"
              value={usuarioBuscado}
              onBlur={()=>{setUsuarioBuscado("")}}
              onChange={(e) => {
                setUsuarioBuscado(e.target.value);
                buscarPorNombre(e.target.value);
              }}
             
            />
            <button
              onClick={() => {
                setUsuariosSeleccionados([]);
                setchatSeleccionado(null);
                setModalListaUsuarios(true);
              }}
            >
              Crear grupo
            </button>
          </div>
          <div>
            {usuarios &&
              !modalListaUsuarios &&
              usuarios.map((usuario) => {
                return (
                  <div
                    className="usuario-encontrado"
                    key={usuario.id}
                    onClick={() => {
                      const usuarioActual = JSON.parse(
                        localStorage.getItem("usuario"),
                      );
                      setUsuariosSeleccionados([usuario, { id: usuarioActual.id }]);
                      setNuevoChat(true);
                      setchatSeleccionado(null);
                      setUsuarios([]);
                      setUsuarioBuscado("");
                    }}
                  >
                    <p className="usuario-nombre">
                      <FontAwesomeIcon icon={faUser} /> {usuario.nombreUsuario}
                    </p>
                  </div>
                );
              })}
          </div>

          {chats && chats.length > 0 ? (
            chats.map((chat) => {
              return (
                <div
                  className={`chat-usuario ${chat.ultimoMensaje?.visto == 1 ? "" : "chat-usuario-no-leido"}`}
                  key={chat.id}
                  onClick={() => {
                    setchatSeleccionado(chat.id);
                    setUsuarioBuscado("");
                    setUsuariosSeleccionados(chat.usuarios);
                    cargarChats();
                  }}
                >
                  <div className="lista-participantes-chat">
          
                    {chat.usuarios.filter(u => u.id !== JSON.parse(localStorage.getItem("usuario")).id)
                    .map((usuario) => (
                      <div key={usuario.id} className="usuario-chat">
                        {usuario.nombreUsuario}
                        
                      </div>
                    ))}
                    {chat.usuarios.length == 1 && <div className="usuario-chat">
                        Tu
                        
                      </div>}
                    
                  </div>
                  <p>
                    {chat.ultimoMensaje.contenido.length > 100
                      ? chat.ultimoMensaje.contenido.substring(0, 100) + "..."
                      : chat.ultimoMensaje.contenido}
                  </p>
                </div>
              );
            })
          ) : (
            <div>
              <h3>
                No hay ningun chat actualmente, inicia una nueva conversacion y
                veras aqui los chats
              </h3>
            </div>
          )}
        </div>
        {chatSeleccionado || nuevoChat ? (
          <ChatUsuario
            key={
              chatSeleccionado ??
              usuariosSeleccionados.map((u) => u.id).join("-")
            }
            chatId={chatSeleccionado}
            destinatarios={usuariosSeleccionados}
            cargarChats={cargarChats}
            setNuevoChat={setNuevoChat}
            setchatSeleccionado={setchatSeleccionado}
          />
        ) : (
          <div id="chats-panel-vacio">
            Esto esta muy limpio por aqui, selecciona un chat para ver su
            contenido
          </div>
        )}
        {modalListaUsuarios && (
          <div
            id="modal-overlay"
            onClick={() => {
              setModalListaUsuarios(false);
              setUsuariosSeleccionados([]);
            }}
          >
            <div id="modal" onClick={(e) => e.stopPropagation()}>
              <div className="div-form ancho">
              <form>
                <input
                  type="text"
                  name=""
                  id=""
                  value={usuarioBuscado}
                  placeholder="Buscar usuario"
                  onChange={(e) => {
                    setUsuarioBuscado(e.target.value);
                    buscarPorNombre(e.target.value);
                  }}
                />

                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    const usuarioActual = JSON.parse(
                      localStorage.getItem("usuario"),
                    );
                    setUsuariosSeleccionados([
                      ...usuariosSeleccionados,
                      { id: usuarioActual.id },
                    ]);
                    setNuevoChat(true);
                    setModalListaUsuarios(false);
                  }}
                >
                  Crear grupo
                </button>
              </form>
              </div>
              <div id="lista-usuarios-encontrados">
                {usuarios.length>0 && <p>Usuarios encontrados:</p>}
                {usuarios &&
                  usuarios.map((usuario) => {
                    return (
                      <div
                        className="usuario-encontrado"
                        key={usuario.id}
                        onClick={() => {
                          setUsuariosSeleccionados([
                            ...usuariosSeleccionados,
                            usuario,
                          ]);
                          setUsuarios([]);
                          setUsuarioBuscado("");
                        }}
                      >
                        <p className="usuario-nombre">
                          {usuario.nombreUsuario}
                        </p>
                      </div>
                    );
                  })}
              </div>
              {usuariosSeleccionados.length>0 && (
                <div>
                  <p>Usuarios seleccionados:</p>
                  {usuariosSeleccionados.map((usuario) => (
                    <div
                      className="usuarios-seleccionados-grupo"
                      key={usuario.id}
                    >
                      <p>
                        {usuario
                          ? usuario.nombreUsuario
                          : "Usuario no encontrado"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default ListarChatsUsuarios;
