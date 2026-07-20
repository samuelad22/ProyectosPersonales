import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Navbar from "./NavBar";
import { useComprobarVeto } from "./useComprobarVeto";
function Inscripcion() {
  useComprobarVeto();

  const { id } = useParams();
  const navigate = useNavigate();
  const obtenerEventoUrl = import.meta.env.VITE_API_URL + "/eventos";
  const inscripcionUrl = import.meta.env.VITE_API_URL + "/eventos/inscribir";
  const borrarInscripcionUrl =
    import.meta.env.VITE_API_URL + "/inscripcion/delete";
  const comprobarInscripcionUrl =
    import.meta.env.VITE_API_URL + "/inscripcionRealizada";
  const realizarPagoUrl = import.meta.env.VITE_API_URL + "/pago/realizarPago";
  const comprobarPagoUrl = import.meta.env.VITE_API_URL + "/pago/comprobarPago";
  const [evento, setEvento] = useState(null);

  const [exito, setExito] = useState(false);
  const [mensajeBoton, setMensajeBoton] = useState("INSCRIBIRSE AL EVENTO");
  const [decidirUrl, setDecidirUrl] = useState(false);
  const [errorServidor, setErrorServidor] = useState("");
  const [errorPasarelaPago, setErrorPasarelaPago] = useState(false);
  const [estadoInscripcion, setEstadoInscripcion] = useState("");
  const [mensajeExitoBorrarInscripcion, setMensajeExitoBorrarInscripcion] =
    useState(false);

  const [errores, setErrores] = useState([]);
  const [datosFormulario, setDatosFormulario] = useState({
    mensaje: "",
    numeroAcompañantes: 0,
  });

  const [searchParams] = useSearchParams();
  const tokenPaypal = searchParams.get("token");

  const gestionarInscripcion = async (token = null) => {
    if (!validarFormulario()) return;
    const respuesta = await fetch(inscripcionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
      body: JSON.stringify({
        evento_id: id,
        usuario_email: JSON.parse(localStorage.getItem("usuario")).email,
        numeroAcompañantes: datosFormulario.numeroAcompañantes ?? 0,
        mensaje: datosFormulario.mensaje ?? "",
        paypalToken: token,
      }),
    });

    if (respuesta.ok) {
      localStorage.removeItem("inscripcion");
      navigate("/exitoInscripcion/" + id, { replace: true });
    } else if (respuesta.status == 400) {
      const data = await respuesta.json();
      setErrorServidor(data.mensaje);
      setMensajeBoton("BORRAR INSCRIPCION");
      setMensajeExitoBorrarInscripcion(false);
      setDecidirUrl(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosFormulario({
      ...datosFormulario,
      [name]: value,
    });
  };

  const borrarInscripcion = async () => {
    const respuesta = await fetch(borrarInscripcionUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
      body: JSON.stringify({
        evento_id: evento.id,
        usuario_email: JSON.parse(localStorage.getItem("usuario")).email,
      }),
    });

    if (respuesta.ok) {
      setMensajeExitoBorrarInscripcion(true);
      setMensajeBoton("INSCRIBIRSE AL EVENTO");
      setDecidirUrl(false);
      setExito(false);
      setErrorServidor("");
      setEstadoInscripcion("");
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (isNaN(datosFormulario.numeroAcompañantes)) {
      nuevosErrores.numeroAcompañantes =
        "El numero de acompañantes debe ser un numero";
    } else if (
      datosFormulario.numeroAcompañantes < 0 ||
      datosFormulario.numeroAcompañantes > 20
    ) {
      nuevosErrores.numeroAcompañantes =
        "El numero de acompañantes tiene que ser como minimo 0 y como maximo 20 ";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length == 0;
  };

  const realizarPago = () => {
    fetch(realizarPagoUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
      body: JSON.stringify({
        evento_id: evento.id,
        usuario_email: JSON.parse(localStorage.getItem("usuario")).email,
        numeroAcompañantes: datosFormulario.numeroAcompañantes ?? 0,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          setErrorPasarelaPago(true);
        }
      })
      .then((data) => {
        localStorage.setItem(
          "inscripcion",
          JSON.stringify({
            numeroAcompañantes: datosFormulario.numeroAcompañantes ?? 0,
            mensaje: datosFormulario.mensaje,
          }),
        );
        window.location.href = data.urlPago;
      });
  };

  const comprobarPago = (token) => {
    fetch(comprobarPagoUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
      },
      body: JSON.stringify({ token }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.captureId) {
          gestionarInscripcion(data.captureId);
        }
      });
  };

  const decidirPeticion = (e) => {
    e.preventDefault();
    if (decidirUrl) {
      borrarInscripcion();
    } else if (evento.precio > 0) {
      realizarPago();
    } else {
      gestionarInscripcion();
    }
  };

  const comprobarInscripcion = () => {
    fetch(obtenerEventoUrl + "/detalle/" + id)
      .then((response) => response.json())
      .then(async (data) => {
        setEvento(data.data);
        const respuesta = await fetch(comprobarInscripcionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("usuario")).token,
          },
          body: JSON.stringify({
            evento_id: data.data.id,
          }),
        });
        if (respuesta.ok) {
          const dataInscripcion = await respuesta.json();
          setDecidirUrl(true);
          setMensajeBoton("BORRAR INSCRIPCION");
          setEstadoInscripcion(dataInscripcion?.mensaje || "");
        }
      });
  };

  useEffect(() => {
    if (tokenPaypal) {
      comprobarPago(tokenPaypal);
    } else {
      comprobarInscripcion();
    }
  }, []);

  if (!localStorage.getItem("usuario")) {
    navigate("/login", { replace: true });
  }
  if (!evento) {
    return (
      <div id="spinner-container">
        {" "}
        <div id="spinner"></div>{" "}
      </div>
    );
  }

  return (
    <div id="vista-inscripcion">
      <Navbar></Navbar>
      <h1 id="titulo-inscripcion">
        <strong>Inscripción</strong> al evento
      </h1>
      <h3 id="subtitulo">Rellena el formulario para completar tu asistencia</h3>
      <div id="inscripcion-contenido">
        <div id="evento-inscripcion">
          <img src={evento.imagen} alt="" />

          <div className="inscripcion-campo-vista">
            <p>Fecha</p>
            <strong>{evento.fechaInicio}</strong>
          </div>
          <div className="inscripcion-campo-vista">
            <p>Hora</p>
            <strong>{evento.horaInicio}</strong>
          </div>
          <div className="inscripcion-campo-vista">
            <p>Ubicacion</p>
            <strong>{evento.ubicacion}</strong>
          </div>
          <div className="inscripcion-campo-vista">
            <p>Aforo disponible</p>
            <strong>
              {evento.aforoMaximo - evento.aforoActual}/{evento.aforoMaximo}
            </strong>
          </div>
          <div className="inscripcion-campo-vista">
            <p>Precio por cabeza</p>
            <strong>{evento.precio.replace(".", ",")} €</strong>
          </div>
          <div className="inscripcion-campo-vista">
            <p>
              En caso de que el aforo este completo o la cantidad de gente que
              se quiera inscribir sea mayor a la cantidad de aforo disponible se
              pasara a una lista de espera donde se ira añadiendo a las personas
              en base a la fecha de inscripcion. En caso de borrar la
              inscripcion se borraran tambien la inscripcion de los
              acompañantes. Si el evento tiene precio se realizara un unico
              cargo el principio, en caso de que empiece el evento y no se
              inscibieran todos los participantes NO SE LE DEVOLVERA EL DINERO
              restante, por el contrario si se cancela la inscripcion sí.
            </p>
          </div>
        </div>
        <form onSubmit={decidirPeticion} noValidate>
          <div className="inscripcion-campo">
            <label>Numero de acompañantes (sin incluirte)</label>
            <input
              type="number"
              id=""
              onChange={handleChange}
              name="numeroAcompañantes"
              value={datosFormulario.numeroAcompañantes}
            />
            {errores.numeroAcompañantes && (
              <span className="errores-formulario">
                {errores.numeroAcompañantes}
              </span>
            )}
          </div>
          <div className="inscripcion-campo">
            <label>Mensaje (opcional)</label>
            <textarea
              name="mensaje"
              id=""
              onChange={handleChange}
              value={datosFormulario.mensaje}
              placeholder="Si tienes alguna duda o necesidad no dudes en comunicarla !!"
            ></textarea>
          </div>
          <button
            type="button"
            id="btn-cancelar-inscripcion"
            onClick={() => {
              navigate("/eventos/eventoDetalle/" + evento.id, {
                replace: true,
              });
            }}
          >
            Cancelar
          </button>
          <button type="submit" id="btn-confirmar-inscripcion">
            {mensajeBoton}
          </button>

          {exito && <p id="mensaje-exito">Inscripción realizada con éxito</p>}

          {errorServidor && (
            <p className="errores-formulario">{errorServidor}</p>
          )}
          {estadoInscripcion && (
            <p className="errores-formulario">{estadoInscripcion}</p>
          )}

          {mensajeExitoBorrarInscripcion && (
            <p id="mensaje-exito-borrar">
              Se ha borrado la inscripcion correctamente
            </p>
          )}
          {errorPasarelaPago && (
            <p className="errores-formulario">
              Ha ocurrido un error al procesar el pago. Por favor, inténtalo de
              nuevo.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
export default Inscripcion;
