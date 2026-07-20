import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Navbar from "./NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCalendarCheck,
  faCircleXmark,
  faClock,
  faEuroSign,
  faImage,
  faLocationArrow,
  faNoteSticky,
  faStar,
  faTag,
  faTags,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useComprobarVeto } from "./useComprobarVeto";

function FormularioCrearEvento() {
  useComprobarVeto();

  const { state } = useLocation();
  const evento = state?.evento ?? null;
  const categoriasUrl = import.meta.env.VITE_API_URL + "/categorias";
  const crearEventoUrl = import.meta.env.VITE_API_URL + "/eventos/crear";
  const actualizarEventoUrl = import.meta.env.VITE_API_URL + "/eventos/editar";
  const [categorias, setCategorias] = useState([]);
  const [errors, setErrors] = useState({});
  const [etiquetas, setEtiquetas] = useState(evento != null ? evento.tags : []);
  const [etiqueta, setEtiqueta] = useState("");
  const hoy = new Date().toISOString().slice(0, 10);

  const [sugerencias, setSugerencias] = useState([]);
  const debounceRef = useRef(null);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    evento_id: evento?.id ?? "",
    nombre: evento?.nombre ?? "",
    ubicacion: evento?.ubicacion ?? "",
    aforoMaximo: evento?.aforoMaximo ?? "",
    fechaInicio: evento?.fechaInicio ?? hoy,
    horaInicio: evento?.horaInicio ?? "20:00",
    fechaFin: evento?.fechaFin ?? "",
    horaFin: evento?.horaFin ?? "",
    imagen: null,
    descripcion: evento?.descripcion ?? "",
    categoria: evento?.categoria?.nombre ?? "",
    precio: evento?.precio ?? 0,
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const validarFormulario = () => {
    let nuevosErrores = {};
    setErrors({});
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    }
    if (!formData.ubicacion.trim()) {
      nuevosErrores.ubicacion = "La ubicacion es obligatorio";
    }
    if (!formData.aforoMaximo) {
      nuevosErrores.aforoMaximo = "El aforo es obligatorio";
    } else if (formData.aforoMaximo <= 0 || formData.aforoMaximo >= 25000) {
      nuevosErrores.aforoMaximo =
        "El aforo debe ser mayor que 0 y menor a 25000";
    }

    if (!formData.fechaInicio) {
      nuevosErrores.fechaInicio = "La fecha de inicio es obligatoria";
    } else if (!validarFecha(new Date(), formData.fechaInicio)) {
      nuevosErrores.fechaInicio =
        "La fecha de inicio debe ser posterior a la fecha actual";
    }

    if (!formData.horaInicio) {
      nuevosErrores.horaInicio = "La hora de inicio es obligatoria";
    } else if (!validarHora(formData.horaInicio)) {
      nuevosErrores.horaInicio = "Formato de hora inválido (hh:mm)";
    }

    if (!formData.categoria) {
      nuevosErrores.categoria = "Selecciona una categoría";
    }
    if (!formData.precio && formData.precio !== 0) {
      nuevosErrores.precio = "El precio es obligatorio";
    } else if (formData.precio < 0 || formData.precio > 100) {
      nuevosErrores.precio =
        "El precio debe ser un número positivo entre 0 y 100";
    }
    if (!formData.imagen && !evento) {
      nuevosErrores.imagen = "Debes subir una imagen para el evento";
    }
    if (etiquetas.length == 0) {
      nuevosErrores.etiquetas = "Debes proporcionar al menos una etiqueta";
    }

    setErrors(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      return true;
    }
  };

  const validarFecha = (fechaAnterior, fechaPosterior) => {
    return new Date(fechaPosterior) > new Date(fechaAnterior);
  };

  const validarHora = (hora) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(hora);
  };

  const enviar = () => {
    if (!validarFormulario()) {
      return;
    }
    setErrors({});

    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("creador_id", JSON.parse(localStorage.getItem("usuario")).id);
    data.append("ubicacion", formData.ubicacion);
    data.append("aforoMaximo", formData.aforoMaximo);
    data.append("fechaInicio", formData.fechaInicio);
    data.append("fechaFin", formData.fechaFin);
    data.append("horaInicio", formData.horaInicio);
    data.append("horaFin", formData.horaFin);
    data.append("descripcion", formData.descripcion);
    data.append("categoria", formData.categoria);
    data.append("precio", formData.precio);
    data.append("imagen", formData.imagen);
    etiquetas.forEach((tag) => {
      data.append("tags[]", tag);
    });
    data.append("evento_id", formData.evento_id);
    if (evento) {
      data.append("_method", "PUT");
    }
    fetch(evento != null ? actualizarEventoUrl : crearEventoUrl, {
      method: "POST",
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
      body: data,
    }).then((response) => {
      if (response.ok || response.status == 200) {
        navigate("/eventos", { replace: true });
      } else if (response.status == 403) {
        setErrors({
          acceso_denegado: "Debido a tu sancion no se pudo crear el evento",
        });
      } else {
        setErrors({ evento_existente: "El evento ya existe" });
      }
    });
  };

  const handleUbicacionChange = (e) => {
    const valor = e.target.value;
    setFormData({ ...formData, ubicacion: valor });
    setSugerencias([]);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (valor.trim().length < 3) return;

    debounceRef.current = setTimeout(() => {
      buscarUbicaciones(valor);
    }, 500);
  };
  const buscarUbicaciones = (query) => {
    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=4&countrycodes=es`,
      { headers: { "Accept-Language": "es" } },
    )
      .then((res) => res.json())
      .then((data) => setSugerencias(data))
      .catch(() => setSugerencias([]));
  };

  const seleccionarSugerencia = (sugerencia) => {
    setFormData({
      ...formData,
      ubicacion: sugerencia.display_name,
    });
    setSugerencias([]);
  };

  useEffect(() => {
    if (!localStorage.getItem("usuario")) {
      navigate("/login", { replace: true });
    }
    fetch(categoriasUrl)
      .then((response) => response.json())
      .then((data) => {
        setCategorias(data.data);
      })
  }, []);

  const añadirEtiqueta = () => {
    if (etiquetas.includes(etiqueta)) return null;
    if (etiqueta.trim() == "") return null;
    setEtiquetas([...etiquetas, etiqueta]);
    setEtiqueta("");
  };
  const quitarEtiqueta = (etiquetaToRemove) => {
    setEtiquetas(etiquetas.filter((tag) => tag !== etiquetaToRemove));
  };
  return (
    <div>
      <Navbar />
      <div className="div-form">
        <h2>Detalla tu evento</h2>
        <form
          onSubmit={(e) => {
            if (e.key == "Enter") {
              return null;
            } else {
              e.preventDefault();
              enviar();
            }
          }}
          noValidate
        >
          <div className="form-grupo">
            <label htmlFor="nombre" id="nombre-label">
              <FontAwesomeIcon icon={faStar} /> Nombre <strong> * </strong>
            </label>

            <input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              type="text"
              placeholder="Dinos el nombre de tu evento"
              onChange={handleChange}
            />
            {errors.nombre && (
              <p className="errores-formulario">{errors.nombre}</p>
            )}
          </div>

          <div className="form-grupo form-recomendaciones">
            <label htmlFor="ubicacion" id="ubicacion-label">
              <FontAwesomeIcon icon={faLocationArrow} /> Ubicación
              <strong> * </strong>
            </label>

            <input
              id="ubicacion"
              name="ubicacion"
              value={formData.ubicacion}
              type="text"
              placeholder="Empieza a escribir una dirección..."
              onChange={handleUbicacionChange}
              autoComplete="off"
            />
            {sugerencias.length > 0 && (
              <ul className="ubicacion-sugerencias">
                {sugerencias.map((s) => (
                  <li
                    key={s.place_id}
                    className="ubicacion-sugerencia-item"
                    onClick={() => seleccionarSugerencia(s)}
                  >
                    {s.display_name}
                  </li>
                ))}
              </ul>
            )}
            {errors.ubicacion && (
              <p className="errores-formulario">{errors.ubicacion}</p>
            )}
          </div>

          <div className="form-grupo">
            <label htmlFor="aforoMaximo" id="aforo-maxim-label">
              <FontAwesomeIcon icon={faUser} /> Aforo máximo
              <strong> * </strong>
            </label>

            <input
              id="aforoMaximo"
              name="aforoMaximo"
              value={formData.aforoMaximo}
              type="number"
              placeholder="Dinos cuanta gente puede asistir a tu evento"
              onChange={handleChange}
            />
            {errors.aforoMaximo && (
              <p className="errores-formulario">{errors.aforoMaximo}</p>
            )}
          </div>
          <div className="form-grupo">
            <label htmlFor="precio" id="precio-label">
              <FontAwesomeIcon icon={faEuroSign} /> Precio por cabeza
              <strong> * </strong>
            </label>

            <input
              id="precio"
              name="precio"
              value={formData.precio}
              type="number"
              onChange={handleChange}
            />
            {errors.precio && (
              <p className="errores-formulario">{errors.precio}</p>
            )}
          </div>

          <div className="form-fila">
            <div className="form-grupo">
              <label htmlFor="fechaInicio" id="fecha-inicio-label">
                <FontAwesomeIcon icon={faCalendar} /> Fecha inicio
                <strong> * </strong>
              </label>

              <input
                id="fechaInicio"
                name="fechaInicio"
                value={formData.fechaInicio}
                type="date"
                onChange={handleChange}
              />
              {errors.fechaInicio && (
                <p className="errores-formulario">{errors.fechaInicio}</p>
              )}
            </div>
            <div className="form-grupo">
              <label htmlFor="horaInicio" id="hora-inicio-label">
                <FontAwesomeIcon icon={faClock} /> Hora inicio
                <strong> * </strong>
              </label>

              <input
                id="horaInicio"
                name="horaInicio"
                value={formData.horaInicio}
                type="text"
                placeholder="20:00"
                onChange={handleChange}
              />
              {errors.horaInicio && (
                <p className="errores-formulario">{errors.horaInicio}</p>
              )}
            </div>
          </div>

          <div className="form-fila">
            <div className="form-grupo">
              <label htmlFor="fechaFin" id="fecha-fin-label">
                <FontAwesomeIcon icon={faCalendarCheck} /> Fecha fin
              </label>
              <input
                id="fechaFin"
                name="fechaFin"
                value={formData.fechaFin}
                type="date"
                onChange={handleChange}
              />
              {errors.fechaFin && (
                <p className="errores-formulario">{errors.fechaFin}</p>
              )}
            </div>
            <div className="form-grupo">
              <label htmlFor="horaFin" id="hora-fin-label">
                <FontAwesomeIcon icon={faClock} /> Hora fin
              </label>
              <input
                id="horaFin"
                name="horaFin"
                value={formData.horaFin}
                type="text"
                onChange={handleChange}
              />
              {errors.horaFin && (
                <p className="errores-formulario">{errors.horaFin}</p>
              )}
            </div>
          </div>

          <div className="form-grupo">
            <label htmlFor="descripcion" id="descripcion-label">
              <FontAwesomeIcon icon={faNoteSticky} /> Descripción
              <strong> * </strong>
            </label>

            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              type="text"
              placeholder="Describenos tu evento..."
              onChange={handleChange}
            />
            {errors.descripcion && (
              <p className="errores-formulario">{errors.descripcion}</p>
            )}
          </div>

          <div className="form-grupo">
            <label htmlFor="categoria" id="categoria">
              <FontAwesomeIcon icon={faTag} /> Categoría <strong> * </strong>
            </label>

            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {categorias.map((categoria) => (
                <option key={categoria.nombre} value={categoria.nombre}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            {errors.categoria && (
              <p className="errores-formulario">{errors.categoria}</p>
            )}
          </div>
          <div className="form-grupo">
            <label htmlFor="etiquetas" id="etiquetas-label">
              <FontAwesomeIcon icon={faTags} /> Añadir intereses
              <strong> * </strong>
            </label>

            <input
              type="text"
              placeholder="Añade los posibles intereses de tu evento..."
              value={etiqueta}
              onChange={(e) => setEtiqueta(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  e.preventDefault();
                  añadirEtiqueta();
                }
              }}
            />
            {errors.etiquetas && (
              <p className="errores-formulario">{errors.etiquetas}</p>
            )}
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
                    type="button"
                    onClick={() => quitarEtiqueta(tag)}
                    className="etiqueta-eliminar"
                  >
                    <FontAwesomeIcon icon={faCircleXmark} />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="form-grupo">
            <label htmlFor="imagen">
              <FontAwesomeIcon icon={faImage} /> Imagen <strong> * </strong>
            </label>

            <input
              id="imagen"
              name="imagen"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, imagen: e.target.files[0] })
              }
            />
            {errors.imagen && (
              <p className="errores-formulario">{errors.imagen}</p>
            )}
          </div>
          {errors.evento_existente && (
            <p className="errores-formulario">{errors.evento_existente}</p>
          )}

          {errors.acceso_denegado && (
            <p className="errores-formulario">{errors.acceso_denegado}</p>
          )}
          <button type="submit">
            {evento ? "Actualizar evento" : "Crear evento"}
          </button>
        </form>
        <Link to="/" id="volver">
          Volver
        </Link>
      </div>
    </div>
  );
}
export default FormularioCrearEvento;
