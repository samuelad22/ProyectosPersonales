import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faCircleXmark,
  faFilter,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { faFilterCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Buscador({
  categoriaSeleccionada,
  filtro,
  setEventos,
  eventosOriginales,
}) {
  const [categorias, setCategorias] = useState([]);
  const [activo, setActivo] = useState(false);
  const [etiquetas, setEtiquetas] = useState([]);
  const [etiqueta, setEtiqueta] = useState("");
  const [sugerenciaEtiqueta, setSugerenciaEtiqueta] = useState("");
  const [sugerenciaUsuario, setSugerenciaUsuario] = useState("");
  const [usuario, setUsuario] = useState("");
  const [formData, setFormData] = useState({
    categoria: "",
    ubicacion: "",
    fechaFin: "",
    fechaInicio: "",
    creador: "",
  });
  const debounceTimer = useRef(null);
  const navigate = useNavigate();
  const apiUrlBase = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetch(apiUrlBase + "/categorias")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCategorias(data.data);
      });
  }, []);

  const añadirEtiqueta = () => {
    if (etiquetas.includes(etiqueta)) return;
    if (etiqueta.trim() == "") {
      return;
    }
    const nuevasEtiquetas = [...etiquetas, etiqueta];
    setEtiquetas(nuevasEtiquetas);
    setEtiqueta("");
    clearTimeout(debounceTimer.current);
    setSugerenciaEtiqueta("");
  };


  const limpiarFiltros = () => {
    filtro("todos");
    setFormData({})
    setEtiquetas([]);
    setUsuario("")
    setEventos(eventosOriginales);
  };
  const quitarEtiqueta = (etiquetaAQuitar) => {
    const nuevasEtiquetas = etiquetas.filter((tag) => tag !== etiquetaAQuitar);
    setEtiquetas(nuevasEtiquetas);

    if (nuevasEtiquetas.length > 0) {
      aplicarFiltro();
    } else {
      limpiarFiltros();
    }
  };
  const escribirEtiqueta = (e) => {
    const texto = e.target.value;
    setEtiqueta(texto);
    setSugerenciaEtiqueta("");

    if (!texto.trim()) {
      clearTimeout(debounceTimer.current);
      setSugerenciaEtiqueta("");
      return;
    }

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      const respuesta = await fetch(apiUrlBase + "/tag/recomendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: texto }),
      });
      const data = await respuesta.json();
      if (data.data) setSugerenciaEtiqueta(data.data.nombre);
    }, 5);
  };
  const autocompletarEtiqueta = (e) => {
    if (sugerenciaEtiqueta && e.key == "Tab") {
      e.preventDefault();
      setEtiqueta(sugerenciaEtiqueta);
      setSugerenciaEtiqueta("");
      return;
    }
    if (e.key == "Enter") {
      e.preventDefault();
      añadirEtiqueta();
    }
  };

   const escribirNombre = (e) => {
    const texto = e.target.value;
    setUsuario(texto);
    setFormData({...formData, creador:texto})
    setSugerenciaUsuario("");

    if (!texto.trim()) {
      clearTimeout(debounceTimer.current);
      setSugerenciaUsuario("");
      return;
    }

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      const respuesta = await fetch(apiUrlBase + "/usuario/recomendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: texto }),
      });
      const data = await respuesta.json();
      if (data.data) setSugerenciaUsuario(data.data.nombre);
    }, 5);
  };

  const autocompletarNombre = (e) => {
    if (sugerenciaUsuario && e.key == "Tab") {
      e.preventDefault();
      setUsuario(sugerenciaUsuario);
      setFormData({...formData, creador:sugerenciaUsuario})
      setSugerenciaUsuario("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const aplicarFiltro = (overrides = {}) => {
    const payload = {
      ...formData,
      ...overrides,
      tags: etiquetas,
    };

    fetch(apiUrlBase + "/eventos/filtrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoria: payload.categoria,
        ubicacion: payload.ubicacion,
        fechaInicio: payload.fechaInicio,
        fechaFin: payload.fechaFin,
        creador: payload.creador,
        tags: payload.tags,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setEventos(data.data || []);
      });
  };

  const sugerenciaUsuarioVisible =
    usuario.trim() !== "" &&
    sugerenciaUsuario &&
    sugerenciaUsuario.toLowerCase().startsWith(usuario.toLowerCase());
  const sugerenciaEtiquetaVisible =
    etiqueta.trim() !== "" &&
    sugerenciaEtiqueta &&
    sugerenciaEtiqueta.toLowerCase().startsWith(etiqueta.toLowerCase());

  return (
    <div id="espacio-busquedas">
      <div id="botones-buscador">
        <p id="parrafo-filtrar">
          <FontAwesomeIcon icon={faFilter} /> Categoria:
        </p>
        <button
          className={`filtro-btn ${categoriaSeleccionada == "todos" ? "activo" : ""}`}
          onClick={() => {
            filtro("todos");
            aplicarFiltro({ categoria: "" });
          }}
        >
          Todos
        </button>
        {categorias.map((categoria) => (
          <button
            key={categoria.id}
            onClick={() => {
              filtro(categoria.nombre);
              aplicarFiltro({ categoria: categoria.id });
            }}
            className={`filtro-btn ${categoria.color} ${categoriaSeleccionada == categoria.nombre ? "activo" : ""}`}
          >
            {categoria.nombre}
          </button>
        ))}
      </div>
      <div id="ajustes-avanzados">
        <div
          onClick={() => {
            setActivo(!activo);
            filtro("todos");
            setFormData({ ...formData, categoria: "" });
          }}
          id="ajustes-avanzados-busqueda"
        >
          <FontAwesomeIcon icon={faSliders} /> Busqueda avanzada
        </div>
        {activo && (
          <div id="modal-overlay" onClick={() => {setActivo(false), setEtiquetas([]), setFormData({})}}>
            <div id="modal" onClick={(e) => e.stopPropagation()}>
              <div className="div-form">
                <form
                  action=""
                  onSubmit={(e) => {
                    e.preventDefault();
                    aplicarFiltro();
                    setActivo(false);
                  }}
                >
                  <div className="form-grupo">
                    <label htmlFor="">
                      <FontAwesomeIcon icon={faLayerGroup} /> Buscar por
                      categoria
                    </label>
                    <select
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      
                    >
                      <option value="">Todas las categorias</option>
                      {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-grupo">
                    <label htmlFor="">Buscar por ubicacion</label>
                    <input
                      type="text"
                      name="ubicacion"
                      value= {formData.ubicacion}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-grupo">
                    <label htmlFor="">Buscar por fecha inicio</label>
                    <input
                      type="date"
                      name="fechaInicio"
                      value={formData.fechaInicio}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-grupo">
                    <label htmlFor="">Buscar por fecha fin</label>
                    <input
                      type="date"
                      name="fechaFin"
                      value={formData.fechaFin}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="ghost-wrapper">
                    <label htmlFor="" name="creador">
                      Buscar por creador
                    </label>
                    <div className="ghost-input">
                      {sugerenciaUsuarioVisible && (
                        <div className="ghost-layer" aria-hidden="true">
                          <span className="ghost-typed">{usuario}</span>
                          <span className="ghost-suggest">
                            {sugerenciaUsuario.slice(usuario.length)}
                          </span>
                        </div>
                      )}
                      <input
                        type="text"
                        placeholder="Buscar por creador"
                        value={usuario}
                        autoComplete="off"
                        spellCheck="false"
                        onChange={(e) => {escribirNombre(e); handleChange(e)}}
                        onKeyDown={(e) => {
                          if (e.key != "Enter") {
                            autocompletarNombre(e);
                          } else {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="ghost-wrapper">
                    <label htmlFor="">Buscar por etiquetas</label>
                    <div className="ghost-input">
                      {sugerenciaEtiquetaVisible && (
                        <div className="ghost-layer" aria-hidden="true">
                          <span className="ghost-typed">{etiqueta}</span>
                          <span className="ghost-suggest">
                            {sugerenciaEtiqueta.slice(etiqueta.length)}
                          </span>
                        </div>
                      )}
                      <input
                        type="text"
                        placeholder="Buscar por etiquetas..."
                        value={etiqueta}
                        autoComplete="off"
                        spellCheck="false"
                        onInput={(e) => {
                          escribirEtiqueta(e);
                        }}
                        onKeyDown={(e) => autocompletarEtiqueta(e)}
			onChange={handleChange}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="enviarEtiquetas"
                    onClick={() => {
                      añadirEtiqueta();
                    }}
                  >
                    Añadir etiqueta
                  </button>

                  <div id="etiquetas">
                    {etiquetas.map((tag) => (
                      <span key={tag} className="etiqueta-busqueda">
                        {tag}
                        <button
                          onClick={() => quitarEtiqueta(tag)}
                          className="etiqueta-eliminar"
                        >
                          <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="botones">
                    <button onClick={limpiarFiltros} id="btn-limpiar">
                      <FontAwesomeIcon icon={faFilterCircleXmark} /> Limpiar
                      filtros
                    </button>
                    <button
                      type="submit"

                    >
                      Buscar coincidencias
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <div id="calendario-busqueda" onClick={() => navigate("/calendario")}>
        <FontAwesomeIcon icon={faCalendarDays} /> Ver calendario
      </div>
    </div>
  );
}
export default Buscador;
