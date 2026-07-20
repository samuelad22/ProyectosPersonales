import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import { useEffect, useState } from "react";
import CarruselEventos from "./Carrusel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faDisplay, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useComprobarVeto } from "./useComprobarVeto";


function UsuarioDetalle() {

    useComprobarVeto();

  const navigate = useNavigate();
  const urlDetalleUsuario = import.meta.env.VITE_API_URL + "/usuarioDetalle";
  const [usuario, setUsuario] = useState(null);
  useEffect(() => {
    if (!localStorage.getItem("usuario")) {
      navigate("/login");
    } else {

      fetch(urlDetalleUsuario, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUsuario(data.data);
        });
    }
  }, []);

  return (
    <div>
        <Navbar />

        {usuario && (
            <div id="datosUsuario">

                <div id="usuario-header">
                    <div id="usuario-avatar">
                        {usuario.nombreCompleto?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 id="usuario-nombre">{usuario.nombreCompleto}</h1>
                        <p id="usuario-username">@{usuario.nombreUsuario}</p>
                    </div>
                    <div id="editar-perfil" className="boton-perfil" onClick={()=> {navigate("/editarCuenta")}}> <FontAwesomeIcon icon={faPenToSquare} /> Editar perfil</div>
                    
                      {JSON.parse(localStorage.getItem('usuario'))?.rol=="admin" && (
                        <div id="panel-administrador" className="boton-admin" onClick={()=> {navigate("/panelAdministrador")}}> <FontAwesomeIcon icon={faDisplay} /> Panel Admin</div>
                )}

                    <div id="logout" className="boton-perfil" onClick={()=> {navigate("/logout")}}> <FontAwesomeIcon icon={faArrowRightFromBracket} /> Log out</div>
                </div>

                <div id="usuario-info">
                    <div className="usuario-campo">
                        <span className="campo-label">Email</span>
                        <span className="campo-valor">{usuario.email}</span>
                    </div>
                    <div className="usuario-campo">
                        <span className="campo-label">Localidad</span>
                        <span className="campo-valor">{usuario.localidadResidencia}</span>
                    </div>
                </div>
                
                <div id="usuario-stats">
                    <div className="stat-card">
                        <span className="stat-numero">{usuario.numeroEventosCreados}</span>
                        <span className="stat-label">Eventos creados</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-numero">{usuario.numeroEventosInscrito}</span>
                        <span className="stat-label">Inscripciones</span>
                    </div>
                </div>

                <div className="usuario-seccion">
                    <h2 className="seccion-titulo" onClick={()=> navigate("/misEventos")}>Eventos creados</h2>
                    <CarruselEventos eventos={usuario.eventosCreados} numeroSlides={3} />
                </div>

                <div className="usuario-seccion">
                    <h2 className="seccion-titulo">Eventos a los que asiste</h2>
                    <CarruselEventos eventos={usuario.eventosInscrito} numeroSlides={3} />
                </div>

            </div>
        )}
    </div>
)
}
export default UsuarioDetalle;
