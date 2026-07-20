import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faEnvelope,
  faFlag,
  faLayerGroup,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useComprobarVeto } from "./useComprobarVeto";

function FormularioEditarCuentaComponent() {

  useComprobarVeto();

  const [formData, setFormData] = useState({
    nombreCompleto: "",
    nombreUsuario: "",
    email: "",
    localidadResidencia: "",
  });

  const [errores, seterrores] = useState({});
  const [etiquetas, setEtiquetas] = useState([]);
  const [etiqueta, setEtiqueta] = useState("");
  const [correoEnUso, setCorreoEnUso] = useState(true);
  const [mensajeErrorVeto, setMensajeErrorVeto] = useState("");
  const informacionUsuario = import.meta.env.VITE_API_URL + "/usuarioDetalle";
  const actualizarCuenta = import.meta.env.VITE_API_URL + "/usuario/actualizar";
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("usuario")) {
      navigate("/login", { replace: true });
      return;
    }

    fetch(informacionUsuario, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("usuario")).token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const usuario = data.data;
        setFormData({
          nombreCompleto: usuario.nombreCompleto,
          nombreUsuario: usuario.nombreUsuario,
          email: usuario.email,
          localidadResidencia: usuario.localidadResidencia,
        });
        setEtiquetas(usuario.intereses ?? []);
      });
  }, []);

  const añadirEtiqueta = () => {
        if (etiquetas.includes(etiqueta)) return null;

    if (etiqueta?.trim() == "") return;
    setEtiquetas([...etiquetas, etiqueta]);
    setEtiqueta("");
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombreCompleto?.trim()) {
      nuevosErrores.nombreCompleto = "El nombre completo es obligatorio";
    }

    if (!formData.nombreUsuario?.trim()) {
      nuevosErrores.nombreUsuario = "El nombre de usuario es obligatorio";
    }

    if (!formData.email?.trim()) {
      nuevosErrores.email = "El email es obligatorio";
    } else if (!formData.email.includes("@")) {
      nuevosErrores.email = "El email debe ser válido";
    }

    if (!formData.localidadResidencia?.trim()) {
      nuevosErrores.localidadResidencia = "La localidad es obligatoria";
    }
    if (etiquetas.length == 0) {
      nuevosErrores.etiquetas = "Debes añadir al menos un interés";
    } else {
      etiquetas.forEach((etiqueta) => {
        if (etiqueta.length > 20) {
          nuevosErrores.etiquetas =
            "El nombre de las etiquetas no puede exceder los 20 caracteres";
        }
      });
    }

    seterrores(nuevosErrores);
    return Object.keys(nuevosErrores).length == 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const enviar = async () => {

    if (!validarFormulario()) {
      return;
    }

    try {
      const respuesta = await fetch(actualizarCuenta, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("usuario")).token}`,
        },
        body: JSON.stringify({
          nombreCompleto: formData.nombreCompleto,
          nombreUsuario: formData.nombreUsuario,
          email: formData.email,
          localidadResidencia: formData.localidadResidencia,
          intereses: etiquetas,
        }),
      });
      if (respuesta.status == 422) {
        setCorreoEnUso(false);
        return;
      } else if (respuesta.status == 403) {
        setMensajeErrorVeto(
          "Debido a tu sancion no tienes permiso para actualizar tu cuenta",
        );
      } else {
        const json = await respuesta.json();
        localStorage.setItem(
          "usuario",
          JSON.stringify({
            token: json.token,
            email: formData.email,
            id: json.id,
            nombreUsuario: json.nombreUsuario,
            rol: json?.rol,
          }),
        );
        navigate("/eventos", { replace: true });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const quitarEtiqueta = (etiquetaToRemove) => {
    setEtiquetas(etiquetas.filter((tag) => tag !== etiquetaToRemove));
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className="div-form">
        <form onSubmit={(e) => { if(e.key === "Enter"){return null} else{e.preventDefault();enviar()} }}>
          <div>
            <label htmlFor="nombreCompleto">
              
              <FontAwesomeIcon icon={faUser} /> Nombre completo
            </label>
            <input
              id="nombreCompleto"
              type="text"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
            />
            {
              <span
                className={
                  errores.nombreCompleto ? "errores-formulario" : "hidden"
                }
              >
                {errores.nombreCompleto}
              </span>
            }
          </div>

          <div>
            <label htmlFor="nombreUsuario">
              
              <FontAwesomeIcon icon={faUser} /> Nombre usuario
            </label>
            <input
              id="nombreUsuario"
              type="text"
              name="nombreUsuario"
              value={formData.nombreUsuario}
              onChange={handleChange}
            />
            {
              <span
                className={
                  errores.nombreUsuario ? "errores-formulario" : "hidden"
                }
              >
                {errores.nombreUsuario}
              </span>
            }
          </div>

          <div>
            <label htmlFor="email">
              
              <FontAwesomeIcon icon={faEnvelope} /> Correo
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {
              <span className={errores.email ? "errores-formulario" : "hidden"}>
                {errores.email}
              </span>
            }
          </div>

          <div>
            <label htmlFor="localidadResidencia">
              
              <FontAwesomeIcon icon={faFlag} /> Localidad de residencia
            </label>
            <input
              id="localidadResidencia"
              type="text"
              name="localidadResidencia"
              value={formData.localidadResidencia}
              onChange={handleChange}
            />
            {
              <span
                className={
                  errores.localidadResidencia ? "errores-formulario" : "hidden"
                }
              >
                {errores.localidadResidencia}
              </span>
            }
          </div>
          <div id="añadir-etiquetas-registro">
            <label htmlFor="">
              
              <FontAwesomeIcon icon={faLayerGroup} /> Añadir intereses
            </label>
            <input
              type="text"
              placeholder="Añade de 1 en 1 tus intereses..."
              value={etiqueta}
              onChange={(e) => setEtiqueta(e.target.value)}
              onKeyDown={(e)=>{if(e.key == "Enter") {e.preventDefault();añadirEtiqueta()}}}
            />
            <button
              type="button"
              className="enviarEtiquetas"
              onClick={() => {
                añadirEtiqueta();
              }}
            >
              Añadir etiqueta
            </button>
            <span
              className={errores.etiquetas ? "errores-formulario" : "hidden"}
            >
              {errores.etiquetas}
            </span>
          </div>
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
          <div>
            <span className={correoEnUso ? "hidden" : "errores-formulario"}>
              Este correo ya esta en uso por otro usuario
            </span>
          </div>
          <div>
            <span
              className={mensajeErrorVeto ? "errores-formulario" : "hidden"}
            >
              {mensajeErrorVeto}
            </span>
          </div>
          <input type="submit" value="Guardar cambios" />
        </form>
        <p
          id="volver"
          onClick={() => {
            navigate(-1);
          }}
        >
          Volver
        </p>
      </div>
    </div>
  );
}

export default FormularioEditarCuentaComponent;
