import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faEnvelope,
  faMoneyBill1,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";

function AdministrarPagos() {
  const [eventos, setEventos] = useState([]);
  const [uris, setUris] = useState({});
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formData, setFormData] = useState({
    nombreEvento: "",
    creadorPaypal: "",
    estadoPago: null,
    fechaFin: ""
  });
  const apiUrlBase = import.meta.env.VITE_API_URL;

  const obtenerEventos = () => {
    fetch(apiUrlBase + "/eventos/obtenerEventosDinero", {
      method: "GET",
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEventos(data.data);
        setUris(data.links?.next);
      });
  };

  const cambiarEstadoPago = (evenoId) => {
    fetch(apiUrlBase + "/eventos/cambiarEstadoPago", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
      body: JSON.stringify({ eventoId: evenoId }),
    });
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const cargarMas = () => {
    fetch(uris, {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEventos((prevEventos) => [...prevEventos, ...data.data]);
        setUris(data.links?.next);
      });
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  }

  const filtrarEventos = () => {
    fetch(apiUrlBase + "/eventos/filtroPagar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
      body: JSON.stringify(formData)
    }).then((response) => response.json())
      .then((data)=> {setEventos(data.data); setUris(data.links?.next)})
  }

  useEffect(() => {
    obtenerEventos();
  }, []);

  return (
    <div id="panel-admin-pagos">
      <div id="panel-admin-pagos-header">
        <h3 id="panel-admin-pagos-titulo">Administrar pagos pendientes</h3>
        <p id="panel-admin-pagos-subtitulo">
          Aqui podras llevar un listado de los eventos a los que se les ha realizado la transferencia del dinero generado en su evento
        </p>
      </div>
      <div id="ajustes-avanzados">
        <div
          id="ajustes-avanzados-busqueda"
          className="ajustes-avanzados-admin"
          onClick={() => setModalAbierto(!modalAbierto)}
        >
          <FontAwesomeIcon icon={faSliders} />
          Filtrar
        </div>
      </div>
      {modalAbierto && (
        <div id="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div id="modal" onClick={(e) => e.stopPropagation()}>
            <div className="div-form">
              <form
                action=""
                onKeyDown={(e)=> {if(e.key=="Enter") {e.preventDefault()}}}
                onSubmit={(e) => {
                  e.preventDefault();
                  setModalAbierto(false);
                  filtrarEventos();
                }}
              >
                <div className="form-grupo">
                  <label htmlFor="nombre">Nombre del evento</label>
                  <input type="text" id="nombreEvento" name="nombreEvento" onChange={handleChange} />
                </div>
                <div className="form-grupo">
                  <label htmlFor="creadorPaypal">Paypal del creador</label>
                  <input type="text" id="creadorPaypal" name="creadorPaypal" onChange={handleChange} onKeyDown={(e)=> {if(e.key=="Enter") {return }}}/>
                </div>
                <div className="form-grupo">
                  <label htmlFor="estadoPago">Estado del pago</label>
                  <select name="estadoPago" id="estadoPago" onChange={handleChange}>
                    <option value={null}>Cualquiera</option>
                    <option value={1}>Pendiente</option>
                    <option value={2}>Realizado</option>
                  </select>
                </div>
                <div className="form-grupo">
                  <label htmlFor="fecha">Fecha finalizacion</label>
                  <input type="date" id="fecha" name="fechaFin" onChange={handleChange} />
                </div>
		<div className="botones">
                <button type="submit">Buscar</button>
                <button type="reset" id="btn-limpiar">
                  Limpiar filtros
                </button>
		</div>
              </form>
            </div>
          </div>
        </div>
      )}
      {eventos && (
        <div className="evento-container">
          {eventos.map((evento) => (
            <div className={"card " + evento.categoria.color} key={evento.id}>
              <img src={evento.imagen} alt={evento.nombre} />
              <div className="card-overlay">
                <p className="card-nombre">{evento.nombre}</p>
                <p className="card-dato">
                  <FontAwesomeIcon icon={faMoneyBill1} />
                  {evento.dineroGenerado}
                </p>
                <p className="card-dato">
                  <FontAwesomeIcon icon={faEnvelope} />
                  {evento.emailPaypal ? evento.emailPaypal : "No especificado"}
                </p>
                <p className="card-dato">
                  <FontAwesomeIcon icon={faCalendar} />
                  {formatearFecha(evento.fechaInicio)}
                </p>
                <p className="card-dato">
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    defaultChecked={evento.estadoPago}
                    onChange={() => {
                      cambiarEstadoPago(evento.id);
                    }}
                  />
                  Pago realizado
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="btn-paginacion">
        {uris && (
          <button id="cargar-mas" onClick={cargarMas}>
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
}
export default AdministrarPagos;
