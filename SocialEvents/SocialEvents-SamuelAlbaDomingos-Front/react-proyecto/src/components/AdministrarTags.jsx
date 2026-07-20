import { useEffect, useState } from "react";

function AdministrarTags() {
  const [etiquetas, setEtiquetas] = useState([]);
  const tagsUrl = import.meta.env.VITE_API_URL + "/tags";
  const [modalEditarTag, setModalEditarTag] = useState(false);
  const [modalBorrarTag, setModalBorrarTag] = useState(false);
  const [tagSeleccionada, setTagSeleccionada] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [hayMas, setHayMas] = useState(true);
  const [hayMenos, setHayMenos] = useState(false);

  const cargarTags = (pagina) => {
    fetch(tagsUrl + `?page=${pagina}`, {
      method: "GET",
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        
        setEtiquetas(data.data.tags);
        setHayMas(data.data.hayMas);
        setPaginaActual(data.data.paginaActual);
        if (data.data.paginaActual > 1) {
          setHayMenos(true);
        }
         else{
          setHayMenos(false)
        }
      })

  };

  const buscarPorNombre = (nombre) => {
    fetch(tagsUrl + "/buscarPorNombre", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
      body: JSON.stringify({ nombre }),
    })
      .then((response) => response.json())
      .then((data) => {
        setEtiquetas(data.data);
      })
    
  };
/*   const cargarMas = () => {
    setPaginaActual(paginaActual + 1);
    cargarTags();  
  };
  const cargarMenos = () => {
    setPaginaActual(paginaActual - 1);
    cargarTags();
  }; */

  const editarTag = (tag) => {
    
    fetch(tagsUrl + "/actualizar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
      body: JSON.stringify({nombre: tag.nombre, id: tag.id, _method: "PUT"}),
    }).then((response)=> {if (response.ok) {cargarTags(); setModalEditarTag(false)}});
  };
  const borrarTag = (tag) => {
    fetch(tagsUrl + "/borrar", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
      body: JSON.stringify({tag_id: tag.id}),
    });
    setModalBorrarTag(false)
    cargarTags();
  };

  useEffect(() => {
    cargarTags(1);
  }, []);

  return (
    <div id="panel-admin-tags">
      <div id="panel-admin-tags-header">
        <h3 id="panel-admin-tags-titulo">Administrar tags</h3>
        <p id="panel-admin-tags-subtitulo">
          Contenido para administrar tags creadas por usuarios
        </p>
      </div>
      <div id="buscar-nombre">
        <input
          type="text"
          name=""
          id=""
          placeholder="Buscar tags por nombre"
          onChange={(e) => {
            buscarPorNombre(e.target.value);
          }}
        />
      </div>
      <div id="etiquetas-admin">
        {etiquetas &&
          etiquetas.map((tag) => (
            <div key={tag.id} className="admin-tag-card">
              <h4 className="admin-tag-nombre"># {tag.nombre}</h4>
              <div className="admin-tag-acciones">
                <button
                  className="admin-tag-btn-editar"
                  onClick={() => {setModalEditarTag(true), setTagSeleccionada(tag);}}
                >
                  Editar
                </button>
                <button
                  className="admin-tag-btn-borrar"
                  onClick={() => {setModalBorrarTag(true); setTagSeleccionada(tag);}}
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
      </div>
      <div className="btn-paginacion">
        {hayMenos && (
          <button id="cargar-menos" onClick={()=> { cargarTags(paginaActual-1)}}>
            Anterior
          </button>
        )}
        {hayMas && (
          <button id="cargar-mas" onClick={()=> { cargarTags(paginaActual+1)}}>
            Siguiente
          </button>
        )}
      </div>
      {modalEditarTag && (
        <div id="modal-overlay" onClick={() => setModalEditarTag(false)}>
          <div id="modal" onClick={(e) => e.stopPropagation()}>
            <div id="formulario-categoria-botones">
              <input type="text" name="nombre" id="" className="nombre-etiqueta-input" value={tagSeleccionada.nombre} onChange={(e) => {setTagSeleccionada({...tagSeleccionada, nombre: e.target.value})}}/>
	    </div>
		 <button type="submit" className="admin-tag-btn-guardar" onClick={() => {editarTag(tagSeleccionada); setModalEditarTag(false);}}>Guardar</button>
          </div>
        </div>
      )}
      {modalBorrarTag && (
        <div id="modal-overlay" onClick={() => setModalBorrarTag(false)}>
          <div id="modal" onClick={(e) => e.stopPropagation()}>
          <p>¿Estás seguro de que quieres borrar este tag?</p>
          <button type="submit" className="admin-tag-btn-borrar" onClick={()=>borrarTag(tagSeleccionada)}>Borrar</button>
          <button type="submit" className="admin-tag-btn-guardar" onClick={() => setModalBorrarTag(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdministrarTags;
