import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useComprobarVeto } from "./useComprobarVeto";

function ReportePosiblesBaneos() {

    useComprobarVeto();

  const [usuariosRiesgo, setUsuariosRiesgo] = useState([]);
  const [estadoPeticion, setEstadoPeticion] = useState(false)
  const [falloGemini, setFalloGemini] = useState(false)
  const navigate = useNavigate();
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("usuario"))?.rol != "admin") {
      navigate("/eventos");
    }
    fetch(import.meta.env.VITE_API_URL + "/ia/posiblesVetos", {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
    })
      .then((data) => {
        if(data.ok) {return data.json()} 
        else{
            setFalloGemini(true)
            setEstadoPeticion(true)
            return
        }})
      .then((jsonData) => {
        setUsuariosRiesgo(jsonData);
        setEstadoPeticion(true)
      });
    
  }, []);



  return (
    <div className="reporte-page">
    <Navbar />
    <div id="panel-admin-usuarios">
    <div id="panel-admin-usuarios-header">
        <div>
            <h2 id="panel-admin-usuarios-titulo">Usuarios de riesgo</h2>
            <p id="panel-admin-usuarios-subtitulo">
                Generado por StreetBot · solo se incluyen comentarios de las últimas 48h
            </p>
        </div>
    </div>
    {estadoPeticion && !falloGemini ? (
        <div id="panel-admin-usuarios-tabla-wrapper">
        {usuariosRiesgo.map((usuario) => (
            <div key={usuario.user_id} className={`reporte-card riesgo-${usuario.riesgo}`}>
                <div className="reporte-card-header">
                    <p className="reporte-nombre">{usuario.nombreUsuario}</p>
                    <span className={`estado-badge reporte-badge badge-${usuario.riesgo}`}>
                        {usuario.riesgo}
                    </span>
                </div>

                <div className="reporte-comentarios">
                    {usuario.comentarios.map((comentario, i) => (
                        <span key={i} className="reporte-tag">"{comentario}"</span>
                    ))}
                </div>

                <div className="reporte-footer">
                    <p className="reporte-motivo">Motivo: {usuario.motivo}</p>
                    <p className="reporte-recomendacion">Recomendacion: {usuario.recomendacion}</p>
                </div>
            </div>
        ))}
    </div>
    ) : falloGemini ?  <h3 className="fallo-gemini"> Has agotado el limite de uso  porfavor vuelva a intentarlo de nuevo mas tarde </h3> : <div id="spinner" /> }

          
    
</div>
</div>
  );
}
export default ReportePosiblesBaneos;
