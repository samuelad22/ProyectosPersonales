import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faBell,
  faCalendarDays,
  faComments,
  faTicket,
  faPlus,
  faBars,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [notificaciones, setNotificaciones] = useState(0);
  const [modalAbierto, setmodalAbierto] = useState(false);

  const toggleMobileMenu = () => setmodalAbierto(!modalAbierto);
  
  fetch(import.meta.env.VITE_API_URL + "/mensajesNoLeidos", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${usuario?.token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      setNotificaciones(data.numeroNotificaciones);
    });

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar`}>
      <div className="navbar-left">
        <button className="navbar-volver" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeftLong} />
          <span>Volver</span>
        </button>
      </div>

      <div className="navbar-center">
        <a href="/" className="navbar-logo">
          Social<strong>Events</strong>
        </a>

        {usuario && (
          <button className="navbar-hamburger" onClick={toggleMobileMenu} aria-label="Toggle menu">
            <FontAwesomeIcon icon={modalAbierto ? faXmark : faBars} />
          </button>
        )}

        {usuario && (
          <div className={`navbar-links ${modalAbierto ? "navbar-links--open" : ""}`}>
            <a
              className={`navbar-link ${isActive("/eventos") ? "navbar-link--active" : ""}`}
              onClick={() => { navigate("/eventos"); setmodalAbierto(false); }}
            >
              <FontAwesomeIcon icon={faTicket} />
              Eventos
            </a>
            <a
              className={`navbar-link ${isActive("/calendario") ? "navbar-link--active" : ""}`}
              onClick={() => { navigate("/calendario"); setmodalAbierto(false); }}
            >
              <FontAwesomeIcon icon={faCalendarDays} />
              Calendario
            </a>
            <a
              className={`navbar-link ${isActive("/chatZone") ? "navbar-link--active" : ""}`}
              onClick={() => { navigate("/chatZone"); setmodalAbierto(false); }}
            >
              <FontAwesomeIcon icon={faComments} />
              Chats
            </a>
          </div>
        )}
      </div>

      <div className="navbar-right">
        {usuario ? (
          <>
            <button
              className="navbar-btn-crear"
              onClick={() => navigate("/crearEvento")}
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Crear</span>
            </button>

            <button
              className="navbar-notificaciones"
              onClick={() => navigate("/chatZone")}
              aria-label="Notificaciones"
            >
              <FontAwesomeIcon icon={faBell} />
              {notificaciones > 0 && (
                <span className="navbar-badge">{notificaciones> 9 ? "9+" : notificaciones}</span>
              )}
            </button>

            <button
              className="navbar-avatar"
              onClick={() => navigate("/usuarioDetalle")}
              aria-label="Perfil de usuario"
            >
              {usuario.nombreUsuario?.charAt(0).toUpperCase()}
            </button>
          </>
        ) : (
          <div className="navbar-auth">
            <a className="navbar-btn-login" href="/login">
              Iniciar sesión
            </a>
            <a className="navbar-btn-registro" href="/crearCuenta">
              Registrarse
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
