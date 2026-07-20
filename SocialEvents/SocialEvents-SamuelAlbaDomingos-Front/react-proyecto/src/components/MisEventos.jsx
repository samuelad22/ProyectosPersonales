import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { useComprobarVeto } from "./useComprobarVeto";

function MisEventos() {

  useComprobarVeto();

  const apiUrl =
    import.meta.env.VITE_API_URL + "/misEventos";
  const [eventos, setEventos] = useState([]);
  const navigate = useNavigate();
  
  const verDetalleEvento = (id) => {
    navigate(`/eventos/eventoDetalle/${id}`);
  };
  useEffect(() => {
    const eventosPeticion = async () => {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization":"Bearer " + JSON.parse(localStorage.getItem("usuario")).token 
        }
      });
      const data = await response.json();
      setEventos(data.data);
    };

    eventosPeticion();
  }, []);
if(eventos.length == 0){
    return ( 
        <div>
            <Navbar/>
            <p id="sin-eventos-mensaje"> <strong> No tienes eventos creados. </strong> Porfavor inicia sesion o crea un evento para poder visualizarlo en esta pestaña</p>
        </div>
    )
}
 const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  return (
 <div>
      <Navbar />
      
      <div className="evento-container">
        {eventos.map((evento) => (
          <div
            className= {"card " + evento.categoria.color}
            key={evento.id}
            onClick={() => verDetalleEvento(evento.id)}
          >
            <img src={evento.imagen} alt={evento.nombre} />
            <div className="card-overlay">
              <p className="card-nombre">{evento.nombre}</p>
              <p className="card-dato">
                <FontAwesomeIcon icon={faCalendar} />{" "}
                {formatearFecha(evento.fechaInicio)}
              </p>
              <p className="card-dato">
                <FontAwesomeIcon icon={faLocationArrow} /> {evento.ubicacion}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
export default MisEventos;
