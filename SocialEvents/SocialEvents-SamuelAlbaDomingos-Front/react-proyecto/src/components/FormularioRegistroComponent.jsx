import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faEnvelope,
  faFlag,
  faLayerGroup,
  faLock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useComprobarVeto } from "./useComprobarVeto";

function FormularioRegistro() {

  useComprobarVeto();

  const [formData, setFormData] = useState({
    nombreCompleto: "",
    nombreUsuario: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    localidadResidencia: "",
  });

  const [errores, setErrores] = useState({});
  const [etiquetas, setEtiquetas] = useState([]);
  const [etiqueta, setEtiqueta] = useState("");
  const crearCuentaUrl = import.meta.env.VITE_API_URL + "/register";
  const navigate = useNavigate();

  const añadirEtiqueta = () => {
    if (etiquetas.includes(etiqueta)) return;
    if (etiqueta.trim() == "") return;
    setEtiquetas([...etiquetas, etiqueta]);
    setEtiqueta("");
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombreCompleto.trim()) {
      nuevosErrores.nombreCompleto = "El nombre completo es obligatorio";
    }

    if (!formData.nombreUsuario.trim()) {
      nuevosErrores.nombreUsuario = "El nombre de usuario es obligatorio";
    }

    if (!formData.email.trim()) {
      nuevosErrores.email = "El email es obligatorio";
    } else if (!formData.email.includes("@")) {
      nuevosErrores.email = "El email debe ser válido";
    }

    if (!formData.password) {
      nuevosErrores.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      nuevosErrores.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.passwordConfirmation) {
      nuevosErrores.passwordConfirmation = "Debe confirmar la contraseña";
    } else if (formData.password != formData.passwordConfirmation) {
      nuevosErrores.passwordConfirmation = "Las contraseñas no coinciden";
    }

    if (!formData.localidadResidencia.trim()) {
      nuevosErrores.localidadResidencia = "La localidad es obligatoria";
    }

    setErrores(nuevosErrores);
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
      const respuesta = await fetch(crearCuentaUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreCompleto: formData.nombreCompleto,
          nombreUsuario: formData.nombreUsuario,
          email: formData.email,
          password: formData.password,
          passwordConfirmation: formData.passwordConfirmation,
          localidadResidencia: formData.localidadResidencia,
          intereses: etiquetas,
        }),
      });

      if (respuesta.status == 400 || respuesta.status == 422) {
        const datos = await respuesta.json();
        const nuevosErrores = {
          datosExistentes: datos.mensaje,
        };
        setErrores(nuevosErrores);
        return;
      }

      const json = await respuesta.json();
      localStorage.setItem(
        "usuario",
        JSON.stringify({
          token: json.token,
          email: formData.email,
          id: json.id,
          nombreUsuario: json.nombreUsuario,
          estado: 0
        }),
      );
      navigate("/eventos", { replace: true });
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
        <form onSubmit={(e) => { if(e.key === "Enter"){return null} else{e.preventDefault();enviar()} }} noValidate>
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
            <label htmlFor="password">
              
              <FontAwesomeIcon icon={faLock} /> Contraseña
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {
              <span
                className={errores.password ? "errores-formulario" : "hidden"}
              >
                {errores.password}
              </span>
            }
          </div>

          <div>
            <label htmlFor="passwordConfirmation">
              
              <FontAwesomeIcon icon={faLock} /> Confirmar contraseña
            </label>
            <input
              id="passwordConfirmation"
              type="password"
              name="passwordConfirmation"
              value={formData.passwordConfirmation}
              onChange={handleChange}
            />
            {
              <span
                className={
                  errores.passwordConfirmation ? "errores-formulario" : "hidden"
                }
              >
                {errores.passwordConfirmation}
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
              onKeyDown={(e)=> {if(e.key == "Enter"){e.preventDefault();añadirEtiqueta()}}}
            />
            <button
              type="button"
              className="enviarEtiquetas"
              onClick={() => {
                añadirEtiqueta();
              }}
            >
              
              {errores.etiquetas}
              Añadir etiqueta
            </button>
          </div>
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
          <div>
            <span
              className={
                errores.datosExistentes ? "errores-formulario" : "hidden"
              }
            >
              {errores.datosExistentes}
            </span>
          </div>
          <input type="submit" value="Crear cuenta" />
        </form>
        <Link to="/" id="volver">
          Volver
        </Link>
      </div>
    </div>
  );
}

export default FormularioRegistro;
