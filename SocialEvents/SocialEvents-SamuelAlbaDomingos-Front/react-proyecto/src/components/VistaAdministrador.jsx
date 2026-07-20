import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import { useEffect, useState } from "react";
import AdministrarUsuarios from "./AdministrarUsuarios";
import AdministrarCategorias from "./AdministrarCategorias";
import AdministrarTags from "./AdministrarTags";
import AdministrarPagos from "./AdministrarPagos"
import ScannerQr from "./ScannerQr"
import { useComprobarVeto } from "./useComprobarVeto";

function VistaAdministrador() {

  useComprobarVeto();

  const navigate = useNavigate();
  
  const [componenteSeleccionado, setComponenteSeleccionado] =
    useState("usuarios");
    useEffect(() => {
    if (JSON.parse(localStorage.getItem("usuario"))?.rol != "admin") {
      navigate("/eventos");
    }
  });
  
  return (
    <div>
      <Navbar />
      <div id="panel-administrador-container">
        <h2 id="panel-administrador-titulo">Panel de administrador</h2>
        <p id="panel-administrador-subtitulo">
          Gestiona los distintos apartados del sistema
        </p>
        <div id="panel-administrador-gestion">
          <h3 id="panel-administrador-gestion-titulo">Zona gestión</h3>
          <div>
            <div id="buscador-tabs">
              <button
                className={`tab-busqueda ${componenteSeleccionado == "usuarios" ? "activo" : ""}`}
                value="usuarios"
                onClick={(e) => setComponenteSeleccionado(e.target.value)}
              >
                Usuarios
              </button>
              <button
                className={`tab-busqueda ${componenteSeleccionado == "pagos" ? "activo" : ""}`}
                value="pagos"
                onClick={(e) => setComponenteSeleccionado(e.target.value)}
              >
                Pagos
              </button>
              <button
                className={`tab-busqueda ${componenteSeleccionado == "categorias" ? "activo" : ""}`}
                value="categorias"
                onClick={(e) => setComponenteSeleccionado(e.target.value)}
              >
                Categorias
              </button>
              <button
                className={`tab-busqueda ${componenteSeleccionado == "tags" ? "activo" : ""}`}
                value="tags"
                onClick={(e) => setComponenteSeleccionado(e.target.value)}
              >
                Tags
              </button>
              <button
                className={`tab-busqueda ${componenteSeleccionado == "entradas" ? "activo" : ""}`}
                value="entradas"
                onClick={(e) => setComponenteSeleccionado(e.target.value)}
              >
                Gestionar entradas
              </button>
            </div>
            {componenteSeleccionado == "usuarios" ? (
              <AdministrarUsuarios />
            ) : componenteSeleccionado == "tags" ? (
              <AdministrarTags />
            ) : componenteSeleccionado == "pagos" ? (
              <AdministrarPagos />
            ) : componenteSeleccionado == "entradas" ? (
              <ScannerQr />
            ) : (
              <AdministrarCategorias />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default VistaAdministrador;
