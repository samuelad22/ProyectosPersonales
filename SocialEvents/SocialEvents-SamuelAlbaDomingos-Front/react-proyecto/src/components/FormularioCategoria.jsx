import { useState } from "react";

const COLORES = ["pink", "cyan", "yellow", "green", "purple", "orange"];

function FormularioCategoria({ categoria, onGuardar, onCancelar }) {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [nombre, setNombre] = useState(categoria?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(categoria?.descripcion ?? "");
  const [colorSeleccionado, setColorSeleccionado] = useState(categoria?.color ?? "cyan");
  const [errors, setErrors] = useState({});

  const editando = categoria !== null && categoria !== undefined;

  const validar = () => {
    const nuevosErrores = {};
    if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!descripcion.trim()) nuevosErrores.descripcion = "La descripción es obligatoria";
    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length == 0;
  };

  const enviar = () => {
    if (!validar()) return;

    const url = editando
      ? apiUrl + "/categoria/editar"
      : apiUrl + "/categoria/crear";

    const body = {
      nombre,
      descripcion,
      color: colorSeleccionado,
    };

    if (editando) {
      body.id = categoria.id;
      body._method = "PUT";
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
      body: JSON.stringify(body),
    }).then((response) => {
      if (response.ok) {
        onGuardar();
      } else {
        setErrors({ servidor: "Error al guardar la categoría" });
      }
    });
  };

  return (
    <div id="formulario-categoria">
      <h3 id="formulario-categoria-titulo">
        {editando ? "Editar categoría" : "Nueva categoría"}
      </h3>
      <p id="formulario-categoria-subtitulo">
        {editando
          ? "Modifica los datos de la categoría"
          : "Define una nueva categoría para organizar tus eventos"}
      </p>

      <div id="formulario-categoria-preview" className={colorSeleccionado}>
        <span id="formulario-categoria-preview-color" className={colorSeleccionado}></span>
        <div id="formulario-categoria-preview-texto">
          <p id="formulario-categoria-preview-nombre">
            {nombre || "Nombre de Categoría"}
          </p>
          <p id="formulario-categoria-preview-descripcion">
            {descripcion || "Descripción de la categoría..."}
          </p>
        </div>
      </div>

      <div className="formulario-categoria-campo">
        <label>Nombre de la Categoría</label>
        <input
          type="text"
          placeholder="Ej: Freestyle, Deportes, Arte..."
          value={nombre}
          onChange={(e) => setNombre(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
        />
        {errors.nombre && <p className="errores-formulario">{errors.nombre}</p>}
      </div>

      <div className="formulario-categoria-campo">
        <label>Descripción</label>
        <textarea
          placeholder="Describe qué tipo de eventos pertenecen a esta categoría..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
          rows={3}
        />
        {errors.descripcion && (
          <p className="errores-formulario">{errors.descripcion}</p>
        )}
      </div>

      <div className="formulario-categoria-campo">
        <label>Color de la Categoría</label>
        <div id="formulario-categoria-colores">
          {COLORES.map((color) => (
            <button
              key={color}
              type="button"
              className={
                "formulario-categoria-color-btn " +
                color +
                (colorSeleccionado == color ? " seleccionado" : "")
              }
              onClick={() => setColorSeleccionado(color)}
            />
          ))}
        </div>
      </div>

      {errors.servidor && (
        <p className="errores-formulario">{errors.servidor}</p>
      )}

      <div id="formulario-categoria-botones">
        <button
          type="button"
          id="formulario-categoria-btn-cancelar"
          onClick={onCancelar}
        >
          Cancelar
        </button>
        <button
          type="button"
          id="formulario-categoria-btn-guardar"
          onClick={enviar}
        >
          {editando ? "Guardar cambios" : "Crear categoría"}
        </button>
      </div>
    </div>
  );
}

export default FormularioCategoria;