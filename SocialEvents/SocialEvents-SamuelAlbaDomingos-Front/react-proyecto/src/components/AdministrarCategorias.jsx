import { useEffect, useState } from "react";
import FormularioCategoria from "./FormularioCategoria";

function AdministrarCategorias() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [categorias, setCategorias] = useState([]);
  const [vista, setVista] = useState("lista");
  const [categoriaEditar, setCategoriaEditar] = useState(null);


  const cargarCategorias = () => {
    fetch(apiUrl + "/categorias", {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
    })
      .then((response) => response.json())
      .then((data) => setCategorias(data.data));
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const abrirCrear = () => {
    setCategoriaEditar(null);
    setVista("formulario");
  };

  const abrirEditar = (categoria) => {
    setCategoriaEditar(categoria);
    setVista("formulario");
  };

  const volverALista = () => {
    setVista("lista");
    setCategoriaEditar(null);
    cargarCategorias();
  };

  if (vista == "formulario") {
    return (
      <FormularioCategoria
        categoria={categoriaEditar}
        onGuardar={volverALista}
        onCancelar={volverALista}
      />
    );
  }

  return (
    <div id="panel-admin-categorias">
      <div id="panel-admin-categorias-header">
        <h3 id="panel-admin-categorias-titulo">Administrar categorías</h3>
        <p id="panel-admin-categorias-subtitulo">
          {categorias.length} categorías registradas
        </p>
        <button id="panel-admin-usuarios-btn" onClick={abrirCrear}>
          Nueva categoría
        </button>
      </div>

      <div id="admin-categorias-grid">
        {categorias.map((cat) => (
          <div key={cat.id} className={"admin-categoria-card " + cat.color}>
            <div className="admin-categoria-info">
              <h4 className="admin-categoria-nombre">{cat.nombre}</h4>
              <p className="admin-categoria-descripcion">
                {cat.descripcion || "Sin descripción"}
              </p>
            </div>
            <div className="admin-tag-acciones">
              <button
                className="admin-tag-btn-editar"
                onClick={() => abrirEditar(cat)}
              >
                Editar
              </button>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdministrarCategorias;