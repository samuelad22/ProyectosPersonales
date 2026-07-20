import { useNavigate } from "react-router-dom";

function HistorialComentario({ historial, usuario }) {
    const navigate = useNavigate();
  return (
    <div className="historial-drawer">
      <h3 className="historial-title">Historial de Comentarios</h3>
      <h6 className="historial-username">{usuario?.nombreUsuario}</h6>
      {historial.length > 0 ?
        historial.map((comentario) => (
          <div className="historial-card" key={comentario.id}>
            {comentario.comentario && (<>
              <p className="historial-evento" onClick={()=> {navigate("/eventos/eventoDetalle/"+comentario.evento.id)}}>{comentario.evento.nombre}</p>
            <strong className="historial-texto">{comentario.comentario}</strong>
            <p className="historial-fecha">{comentario.fechaPublicacion}</p>
            </>
            )}
            
          </div>
        )): <div><strong className="historial-texto">No hay comentarios para mostrar.</strong></div>}
    </div>
  );
}
export default HistorialComentario;