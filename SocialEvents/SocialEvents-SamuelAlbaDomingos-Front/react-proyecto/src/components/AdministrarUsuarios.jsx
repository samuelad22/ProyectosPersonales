import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faThumbtack,
  faUnlock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import HistorialComentario from "./HistorialComentario";

function AdministrarUsuarios() {
  const navigate = useNavigate();

  const obtenerUsuariosUri = import.meta.env.VITE_API_URL + "/usuarios/listar";
  const gestionarVetosUri = import.meta.env.VITE_API_URL + "/usuario/";
  const [usuarios, setUsuarios] = useState([]);
  const [datos, setDatos] = useState({});
  const [errorFechaInvalida, setErrorFechaInvalida] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [hayMas, setHayMas] = useState(true);
  const [hayMenos, setHayMenos] = useState(false);
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [historialComentariosUsuario, setHistorialComentariosUsuario] =
    useState([]);
  const [modal, setModal] = useState(false);
  const [modalVetoTemporal, setModalVetoTemporal] = useState(false);
  const [modalVetoPermanente, setModalVetoPermanente] = useState(false);
  const [
    modalConfirmacionHabilitarUsuario,
    setModalConfirmacionHabilitarUsuario,
  ] = useState(false);

  const [formDataDeshabilitarTemporal, setFormDataDeshabilitarTemporal] =
    useState({
      correo: JSON.parse(localStorage.getItem("usuario")).correo,
      fechaFinVeto: "",
      motivoVeto: "",
    });
  const [formDataDeshabilitarPermanente, setFormDataDeshabilitarPermanente] =
    useState({
      correo: JSON.parse(localStorage.getItem("usuario")).correo,
      motivoVeto: "",
    });
  const [formDataHabilitar, setFormDataHabilitar] = useState({
    correo: JSON.parse(localStorage.getItem("usuario")).correo,
  });

  const cargarUsuarios = (pagina) => {
    fetch(obtenerUsuariosUri + `?page=${pagina}`, {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        setUsuarios(data.data.usuarios);
        setHayMas(data.data.hayMas);
        setPaginaActual(data.data.paginaActual);
        setDatos(data.data);
        if (data.data.paginaActual > 1) {
          setHayMenos(true);
        }
        else{
          setHayMenos(false)
        }
      });
  };

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("usuario"))?.rol != "admin") {
      navigate("/eventos");
    }
    cargarUsuarios(1);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataDeshabilitarTemporal({
      ...formDataDeshabilitarTemporal,
      [name]: value,
    });
  };
  const handleChangePermanente = (e) => {
    const { name, value } = e.target;
    setFormDataDeshabilitarPermanente({
      ...formDataDeshabilitarPermanente,
      [name]: value,
    });
  };

  const vetarTemporalmente = (e) => {
    e.preventDefault();
    if (new Date(formDataDeshabilitarTemporal.fechaFinVeto) < new Date()) {
      setErrorFechaInvalida(true);
      return;
    }
    fetch(gestionarVetosUri + "vetarTemporalmente", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
      body: JSON.stringify({
        email: formDataDeshabilitarTemporal.correo,
        fechaLimiteVeto: formDataDeshabilitarTemporal.fechaFinVeto,
        motivoVeto: formDataDeshabilitarTemporal.motivoVeto,
      }),
    }).then(() => {
      cargarUsuarios(paginaActual);
      setModalVetoTemporal(false);
      setModal(false);
    });
  };
  const vetarPermanente = (e) => {
    e.preventDefault();
    fetch(gestionarVetosUri + "vetarPermanentemente", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
      body: JSON.stringify({
        email: formDataDeshabilitarPermanente.correo,
        motivoVeto: formDataDeshabilitarPermanente.motivoVeto,
      }),
    }).then(() => {
      cargarUsuarios(paginaActual);
      setModalVetoPermanente(false);
      setModal(false);
    });
  };

  const habilitarUsuario = (e) => {
    e.preventDefault();
    fetch(gestionarVetosUri + "eliminarVeto", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
      body: JSON.stringify({
        email: formDataHabilitar.correo,
      }),
    }).then(() => {
      cargarUsuarios(paginaActual);
      setModalConfirmacionHabilitarUsuario(false);
    });
  };

  const cargarHistorialUsuario = (usuario) => {
    fetch(
      import.meta.env.VITE_API_URL + "/valoracion/obtenerComentariosUsuario",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
        },
        method: "POST",
        body: JSON.stringify({
          email: usuario.email,
        }),
      },
    )
      .then((response) => response.json())
      .then((data) => {
        setHistorialComentariosUsuario(data.data);
      });
  };

  const buscarPorNombre = (nombre) => {
    fetch(import.meta.env.VITE_API_URL + "/usuarios/buscarPorNombre", {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
      method: "POST",
      body: JSON.stringify({
        nombreUsuario: nombre,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUsuarios(data.data);
      });
  };
  return (
    <div id="panel-admin-usuarios">
      <div id="panel-admin-usuarios-header">
        <h3 id="panel-admin-usuarios-titulo">Administrar usuarios</h3>
        <p id="panel-admin-usuarios-subtitulo">
          Contenido para administrar usuarios
        </p>
        <button
          id="panel-admin-usuarios-btn"
          onClick={() => navigate("/reportePosiblesBaneos")}
        >
          Estudiar reporte IA
        </button>
      </div>
      <div id="usuario-stats-admin">
        <div className="stat-card">
          <span className="stat-numero">
            {datos.numeroUsuarios ? datos.numeroUsuarios : 0}
          </span>
          <span className="stat-label">Numero Usuarios</span>
        </div>
        <div className="stat-card">
          <span className="stat-numero">
            {datos.numeroUsuariosActivos ? datos.numeroUsuariosActivos : 0}
          </span>
          <span className="stat-label">Numero Usuarios Activos</span>
        </div>
        <div className="stat-card">
          <span className="stat-numero">
            {datos.numeroUsuariosDesactivados
              ? datos.numeroUsuariosDesactivados
              : 0}
          </span>
          <span className="stat-label">Numero Usuarios Desactivados</span>
        </div>
      </div>

      <div id="buscar-nombre">
        <input
          type="text"
          name=""
          id=""
          placeholder="Buscar por nombre usuario"
          onChange={(e) => {
            if(e.target.value) {
              buscarPorNombre(e.target.value);
            } else {
              cargarUsuarios(1);
            }
          }}
        />
      </div>
      <div id="panel-admin-usuarios-tabla-wrapper">
        <table id="panel-admin-usuarios-tabla">
          <thead>
            <tr>
              <th>Nombre de usuario</th>
              <th>Nombre completo</th>
              <th>
                
                
                <FontAwesomeIcon icon={faEnvelope} /> Email
              </th>
              <th>
                
                
                <FontAwesomeIcon icon={faThumbtack} /> Localidad
              </th>
              <th>Intereses</th>
              <th>Estado</th>
              <th>Acciones</th>
              <th>Historial de comentarios</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario, index) => (
              <tr className="panel-admin-usuarios-fila" key={index}>
                <td>
                  <FontAwesomeIcon icon={faUser} /> {usuario.nombreUsuario}
                </td>
                <td>{usuario.nombreCompleto}</td>
                <td>{usuario.email}</td>
                <td>{usuario.localidadResidencia}</td>
                <td>
                  {usuario.intereses.map((etiqueta) => (
                    <strong key={etiqueta}>{etiqueta}</strong>
                  ))}
                </td>
                <td>
                  <span
                    className={
                      usuario.estado == 0
                        ? "estado-badge estado-badge--activo"
                        : "estado-badge estado-badge--inactivo"
                    }
                  >
                    {usuario.estado == 0
                      ? "Activo"
                      : usuario.estado == 2
                        ? "Restringido"
                        : "Baneado"}
                  </span>
                </td>
                <td className="panel-admin-usuarios-acciones">
                  <button
                    className={`btn-habilitar ${usuario.estado == 0 ? "hidden" : ""}`}
                    onClick={() => {
                      (setModalConfirmacionHabilitarUsuario(true),
                        setFormDataHabilitar({ correo: usuario.email }));
                    }}
                  >
                    <FontAwesomeIcon icon={faUnlock} /> Habilitar
                  </button>
                  <button
                    className={`btn-deshabilitar ${usuario.estado == 1 || usuario.estado == 2 ? "hidden" : ""}`}
                    onClick={() => {
                      (setModal(true),
                        (formDataDeshabilitarTemporal.correo = usuario.email),
                        (formDataDeshabilitarPermanente.correo =
                          usuario.email));
                    }}
                  >
                    <FontAwesomeIcon icon={faLock} />
                    Deshabilitar
                  </button>
                </td>
                <td>
                  <button
                    className="btn-historial"
                    onClick={() => {
                      cargarHistorialUsuario(usuario);
                      setUsuarioActivo(usuario);
                    }}
                  >
                    Ver historial de comentarios
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="btn-paginacion">
       
        {hayMenos && (
          <button
            id="cargar-mas"
            onClick={() => cargarUsuarios(paginaActual - 1)}
          >
            Cargar pagina anterior
          </button>
        )}
        
         {hayMas && (
          <button
            id="cargar-mas"
            onClick={() => cargarUsuarios(paginaActual + 1)}
          >
            Cargar siguiente pagina
          </button>
        )}

        </div>
        {modal && (
          <div id="modal-overlay" onClick={() => setModal(false)}>
            <div id="modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="btn-vetos"
                onClick={() => {
                  setModalVetoTemporal(true);
                }}
              >
                Vetar temporalmente
              </button>
              <button
                className="btn-vetos"
                onClick={() => {
                  setModalVetoPermanente(true);
                }}
              >
                Vetar permanentemente
              </button>
            </div>
          </div>
        )}
        {modalVetoTemporal && (
          <div id="modal-overlay" onClick={() => setModalVetoTemporal(false)}>
            <div id="modal" onClick={(e) => e.stopPropagation()}>
              <div className="div-form">
                <form
                 onKeyDown={(e)=> {if(e.key=="Enter") {e.preventDefault()}}}
                  onSubmit={(e) => {
                    vetarTemporalmente(e);
                  }}
                >
                  <label htmlFor="fecha-fin-veto" className="motivo-veto">
                    Fin veto
                  </label>
                  <input
                    type="date"
                    id="fecha-fin-veto"
                    value={formDataDeshabilitarTemporal.fechaFinVeto}
                    name="fechaFinVeto"
                    onChange={handleChange}
                  />
                  
                  <label htmlFor="motivo-veto" className="motivo-veto">
                    
                    Motivo
                  </label>
                  <input
                    type="text"
                    id="motivo-veto"
                    value={formDataDeshabilitarTemporal.motivoVeto}
                    name="motivoVeto"
                    onChange={handleChange}
                    className="motivo-veto-input"
                    placeholder="Motivo de la sancion"
                  />
                  {errorFechaInvalida && (
                    <div className="errores-formulario">
                      La fecha de finalización del veto debe ser posterior a la
                      fecha actual.
                    </div>
                  )}
                  
                  <button type="submit">Guardar</button>
                </form>
              </div>
            </div>
          </div>
        )}
        {modalVetoPermanente && (
          <div id="modal-overlay" onClick={() => setModalVetoPermanente(false)}>
            <div id="modal" onClick={(e) => e.stopPropagation()}>
              <div className="div-form">
              <form onSubmit={(e) => vetarPermanente(e)} onKeyDown={(e)=> {if(e.key=="Enter") {e.preventDefault()}}}>
                <label htmlFor="motivo-veto" className="motivo-veto">  
                  Motivo
                </label>
                <input
                  type="text"
                  id="motivo-veto"
                  value={formDataDeshabilitarPermanente.motivoVeto}
                  name="motivoVeto"
                  onChange={handleChangePermanente}
                  className="motivo-veto-input"
                  placeholder="Motivo de la sancion"
                />
                
                <button type="submit">Guardar</button>
                
              </form>
              </div>
            </div>
          </div>
        )}
        {modalConfirmacionHabilitarUsuario && (
          <div
            id="modal-overlay"
            onClick={() => setModalConfirmacionHabilitarUsuario(false)}
          >
            <div id="modal" onClick={(e) => e.stopPropagation()}>
              <div className="div-form">
                <form onSubmit={(e) => habilitarUsuario(e)}>
                  <p>
                    Estas seguro de que deseas habilitar a este usuario,
                    recuerda que puede ser un riesgo para la comunidad.
                  </p>
                  <button type="submit">Habilitar</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {usuarioActivo && (
          <>
            <HistorialComentario
              historial={historialComentariosUsuario}
              usuario={usuarioActivo}
            />
            <div
              className="drawer-overlay"
              onClick={() => {
                setUsuarioActivo(null);
                setHistorialComentariosUsuario([]);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
export default AdministrarUsuarios;
