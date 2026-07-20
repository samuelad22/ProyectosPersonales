import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {  useState } from "react";
import Navbar from "./NavBar";
import { useComprobarVeto } from "./useComprobarVeto";

function FormularioLogin() {

  useComprobarVeto();

  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("")
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const enviar = async (data) => {
    const respuesta = await fetch(apiUrl + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    const json = await respuesta.json();
    if (respuesta.ok) {
      localStorage.setItem(
        "usuario",
        JSON.stringify({ token: json.token, email: data.email, id:json.id, nombreUsuario: json.nombreUsuario, rol: json.rol, estado: json.estado }),
      );
      navigate("/eventos", {replace: true});
    }
    else if(respuesta.status == 402) {
      setError(json.error)
    }
    else {
      setError("Usuario o contraseña incorrectas")
    }
  };
 
  return (
    <div>
      <Navbar></Navbar>
    <div className="div-form">
      <form onSubmit={handleSubmit(enviar)}>
        <div className={error ? 'errores-formulario' : 'hidden'}>
        {error}
        </div>
        <div>
          <label>Correo</label>
          <input type="email" {...register("email")} />
        </div>
        <div>
          <label>Contraseña</label>
          <input type="password" {...register("password")} />
        </div>
        <input type="submit" value="Iniciar sesion" />
      </form>
      <Link to="/">Volver</Link>
    </div>
    </div>
  );
}

export default FormularioLogin;
