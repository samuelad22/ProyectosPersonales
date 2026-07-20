import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Carrusel from "./Carrusel";

function Index() {
  const mensajeIntroductorioUrl =
    import.meta.env.VITE_API_URL + "/ia/mensajeIntroductorio";
  const eventosCarruselUrl = import.meta.env.VITE_API_URL + "/eventos/carrusel";
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const navigate = useNavigate();

  const [datoCurioso, setDatoCurioso] = useState("");
  const [eventos, setEventos] = useState([]);

  const obtenerDato = () => {
    fetch(mensajeIntroductorioUrl)
      .then((response) => response.json())
      .then((data) => {
        setDatoCurioso(data.dato);
      });
  };
  const obtenerEventosCarrusel = () => {
    fetch(eventosCarruselUrl)
      .then((response) => response.json())
      .then((data) => {
        setEventos(data.data);
      });
  };

  useEffect(() => {
    obtenerDato();
    obtenerEventosCarrusel();
  }, []);

  return (
    <div id="hero">
      <div id="hero-contenido">
        <h1>
          Social <strong>Events</strong>
        </h1>
        <p id="hero-subtitulo">La calle se une aquí</p>
        <div className="hero-botones">
          {!usuario ? (
            <div>
              <a href="/login">Iniciar sesión</a>
              <a href="/crearCuenta">Crear cuenta</a>
            </div>
          ) : (
            <div id="acciones-usuario">
              <p
                className="categorias-index-crear-evento acciones-usuario"
                onClick={() => navigate("/crearEvento")}
              >
                Crear evento
              </p>
              <p
                className="categorias-index-mostrar-mi-perfil acciones-usuario"
                onClick={() => navigate("/usuarioDetalle")}
              >
                Mi perfil
              </p>
              <p
                onClick={() => navigate("/logout")}
                id="logout"
                className="acciones-usuario"
              >
                Cerrar sesion
              </p>
            </div>
          )}
        </div>
        <div className="hero-botones">
          <p
            className="categorias-index-mostrar-evento"
            onClick={() => navigate("/eventos")}
          >
            {usuario ? "Ver eventos" : "Explorar eventos disponibles"}
          </p>
          {usuario && (
            <p
              className="categorias-index-mostrar-chat-zone"
              onClick={() => navigate("/chatZone")}
            >
              Chat Zone
            </p>
          )}
        </div>
        {datoCurioso ? (
          <p id="datoCurioso">{datoCurioso}</p>
        ) : (
          <div id="loading-dato-curioso">
            <p>Cargando dato curioso...</p>
            <div id="spinner" />
          </div>
        )}
      </div>

      <section id="carrusel-eventos">
        <h2>Proximos eventos disponibles</h2>
        <Carrusel eventos={eventos} numeroSlides={1}></Carrusel>
      </section>
    </div>
  );
}
export default Index;
