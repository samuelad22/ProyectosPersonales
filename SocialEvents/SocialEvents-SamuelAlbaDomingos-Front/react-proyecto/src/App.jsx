import "./App.css";
import Index from "./components/IndexComponent";
import { Routes, Route } from "react-router-dom";
import EventoDetalle from "./components/EventoDetalleComponent";
import ListarEventos from "./components/ListarEventosComponent";
import FormularioLogin from "./components/FormularioLoginComponent";
import FormularioRegistro from "./components/FormularioRegistroComponent";
import FormularioCrearEvento from "./components/FormularioCrearEvento";
import MisEventos from "./components/MisEventos";
import Inscripcion from "./components/Inscripcion";
import Calendario from "./components/Calendario";
import Logout from "./components/Logout";
import UsuarioDetalle from "./components/UsuarioDetalleComponent";
import FormularioEditarCuentaComponent from "./components/FormularioEditarCuentaComponent";
import VistaAdministrador from "./components/VistaAdministrador";
import ReportePosiblesBaneos from "./components/ReportePosiblesBaneos";
import PantallaBan from "./components/VistaSancion";
import CrearCategoria from "./components/FormularioCategoria";
import ListarChatsUsuarios from "./components/ListaChatsUsuario";
import ExitoInscripcion from "./components/exitoInscripcion";
import QRScanner from "./components/ScannerQr";
import NotificacionMensaje from "./components/NotificacionMensaje";
import { useEffect, useState } from "react";
import echo from "./echo";
function App() {
  const [notificacion, setNotificacion] = useState(null);
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  
  const canales = [];
  useEffect(() => {
    if (!usuario) return;
    fetch(import.meta.env.VITE_API_URL + "/chats", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${usuario.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.data) return;
        data.data.forEach((chat) => {
          echo
            .private(`conversacion.${chat.id}`)
            .listen(".MensajeEnviado", (e) => {
              if (e.remitenteId !== usuario.id) {
                setNotificacion(e);
              }
            });
          canales.push(chat.id);
        });
      });
    return () => {
      canales.forEach((id) => {
        echo.leave(`conversacion.${id}`);
      });
    };
  }, []);

  return (
    <div>
      <NotificacionMensaje
        notificacion={notificacion}
        onClose={() => setNotificacion(null)}
      />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/eventos" element={<ListarEventos />} />
        <Route path="/usuarioDetalle" element={<UsuarioDetalle />} />
        <Route
          path="/editarCuenta"
          element={<FormularioEditarCuentaComponent />}
        />
        <Route path="/eventos/eventoDetalle/:id" element={<EventoDetalle />} />
        <Route path="/login" element={<FormularioLogin />} />
        <Route path="/crearCuenta" element={<FormularioRegistro />} />
        <Route path="/crearEvento" element={<FormularioCrearEvento />} />
        <Route path="/editarEvento" element={<FormularioCrearEvento />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/misEventos" element={<MisEventos />} />
        <Route path="/inscripcion/:id" element={<Inscripcion />} />
        <Route path="/exitoInscripcion/:id" element={<ExitoInscripcion />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/panelAdministrador" element={<VistaAdministrador />} />
        <Route
          path="/reportePosiblesBaneos"
          element={<ReportePosiblesBaneos />}
        />
        <Route path="/sancion" element={<PantallaBan />} />
        <Route path="/crearCategoria" element={<CrearCategoria />} />
        <Route path="/chatZone" element={<ListarChatsUsuarios />} />
        <Route path="/scannerQr" element={<QRScanner />} />
      </Routes>
    </div>
  );
}

export default App;
