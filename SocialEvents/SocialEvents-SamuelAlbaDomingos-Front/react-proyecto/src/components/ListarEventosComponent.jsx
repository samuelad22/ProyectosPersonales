import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Buscador from "./Buscador";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { useComprobarVeto } from "./useComprobarVeto";

function ListarEventos() {
  useComprobarVeto();

  const urlEventos = import.meta.env.VITE_API_URL + "/eventos";
  const recomendacionUrl = import.meta.env.VITE_API_URL + "/ia/recomendaciones";
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [uris, setUris] = useState({});
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todos");
  const [recomendaciones, setRecomendaciones] = useState(null);
  const [eventosOriginales, setEventosOriginales] = useState([]);
  const [nombreEventoBuscado, setNombreEventoBuscado] = useState("")

  const filtrarPorCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
  };

  const cargarEventos = () => {
    let apiUrl = urlEventos;
    if (categoriaSeleccionada !== "todos") {
      apiUrl += "/" + categoriaSeleccionada;
    }
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setEventos(data.data);
        if (categoriaSeleccionada == "todos") {
          setEventosOriginales(data.data);
        }
        setUris(data.links.next);
      });
  };

  

  const buscarPorNombre = async (nombre) => {

    let apiUrl = urlEventos + "/buscar";
    const respuesta = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: nombre,
      }),
    });
    const datos = await respuesta.json();
    setEventos(datos.data);
  };

  const verDetalleEvento = (id) => {
    navigate(`/eventos/eventoDetalle/${id}`);
  };

  useEffect(() => {
    cargarEventos()
    if (localStorage.getItem("usuario")) {
      fetch(recomendacionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setRecomendaciones(data.respuesta);
        });
    }
  }, []);

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  const cargarMas = () => {
    fetch(uris)
      .then((response) => response.json())
      .then((data) => {
        setEventos((prevEventos) => [...prevEventos, ...data.data]);
        setUris(data.links.next);
      });
  };

  return (
    <div>
      <Navbar />
      <div id="zona-busqueda">
        <div id="buscar-nombre">
          <input
            type="text"
            name=""
            id=""
            placeholder="Buscar evento..."
            onChange={(e) => {
              setNombreEventoBuscado(e.target.value);
              buscarPorNombre(e.target.value);
            }}
          />
        </div>
        <Buscador
          categoriaSeleccionada={categoriaSeleccionada}
          filtro={filtrarPorCategoria}
          setEventos={setEventos}
          eventosOriginales={eventosOriginales}
          setUris={setUris}
        />
      </div>

      {recomendaciones ? (
        <div id="recomendacionIa">
          <div id="lista-recomendaciones">{recomendaciones}</div>
        </div>
      ) : localStorage.getItem("usuario") ? (
        <div id="loading-recomendaciones">
          <p>Cargando recomendaciones...</p>
          <div id="spinner" />
        </div>
      ) : (
        <div id="loading-recomendaciones">
          <p>
            Incia sesion para que te mostremos recomendacions de eventos que
            pueda interesarte
          </p>
        </div>
      )}
      <div className="evento-container">
        {eventos.map((evento) => (
          <div
            className={"card " + evento.categoria.color}
            key={evento.id}
            onClick={() => verDetalleEvento(evento.id)}
          >
            <img src={evento.imagen} alt={evento.nombre} />
            <div className="card-overlay">
              <p className="card-nombre">{evento.nombre}</p>
              <p className="card-dato">
                <FontAwesomeIcon icon={faCalendar} />
                {formatearFecha(evento.fechaInicio)}
              </p>
              <p className="card-dato">
                <FontAwesomeIcon icon={faLocationArrow} /> {evento.ubicacion}
              </p>
            </div>
          </div>
        ))}
      </div>
      {uris && !nombreEventoBuscado && (
        <div className="btn-paginacion">
          <button id="cargar-mas" onClick={cargarMas}>
            Siguiente
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default ListarEventos;
