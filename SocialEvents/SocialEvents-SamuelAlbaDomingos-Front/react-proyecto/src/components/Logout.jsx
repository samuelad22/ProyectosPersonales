import { useNavigate } from "react-router-dom";
import { useComprobarVeto } from "./useComprobarVeto";

function Logout() {

    useComprobarVeto();

const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    window.location.href = '/'
}
const navigate = useNavigate();

    return (<div id="cerrar-sesion-container">
    <p>Seguro que quieres cerrar sesión?</p>
    <div style={{ display: "flex", gap: "16px" }}>
        <button id="btn-confirmar-sesion" onClick={cerrarSesion}>Si</button>
        <button id="btn-cancelar-sesion" onClick={() => navigate(-1)}>No</button>
    </div>
</div>)
}

export default Logout