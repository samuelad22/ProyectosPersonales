import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

function PantallaBan() {
  const apiUrl= import.meta.env.VITE_API_URL + "/usuario/informacionBaneado";
  const [usuario, setUsuario] = useState(null);
  const motivo    = usuario?.motivo_veto  ?? "No especificado";
  const hasta     = usuario?.vetado_hasta
    ? new Date(usuario.vetado_hasta).toLocaleDateString("es-ES", {
        day: "numeric", month: "long", year: "numeric",
      })
    : "Indefinido";
const cargarUsuario = ()=> {
    fetch(apiUrl, {
        method: "POST",
        headers: {"Content-Type": "application/json", 
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("usuario")).token}
    })
    .then((response) => response.json())
    .then((data) => {
      setUsuario(data.data)
    })
}

useEffect(()=> {
cargarUsuario()
}, {})
  return (
    <div id="pantalla-ban">
     {usuario && (
         <div className="ban-card">

        <div className="ban-icono">
          <FontAwesomeIcon icon={faBan} />
        </div>

        <h1 className="ban-titulo">Cuenta suspendida</h1>
        <p className="ban-subtitulo">Tu acceso a StreetConnect ha sido restringido</p>

        <div className="ban-detalle">
          <span className="ban-detalle-label">Motivo</span>
          <span className="ban-detalle-valor motivo">{motivo}</span>
        </div>
        
        <div className="ban-detalle">
          <span className="ban-detalle-label">Suspendido hasta</span>
          <span className="ban-detalle-valor fecha">{hasta}</span>
        </div>

        <p className="ban-footer">
          Si crees que esto es un error, contacta con el equipo de StreetConnect.
        </p>

      </div>
     )}
    </div>
  );
}

export default PantallaBan;