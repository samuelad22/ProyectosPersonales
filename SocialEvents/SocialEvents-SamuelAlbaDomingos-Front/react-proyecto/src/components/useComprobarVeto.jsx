import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useComprobarVeto() {
  const navigate   = useNavigate();
  const apiUrl     = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario?.token) return;

    fetch(apiUrl + "/usuario/comprobarVeto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + usuario.token,
      },
    }).then((response) => {
      if (response.status === 400) {
        navigate("/sancion", { replace: true });
      }
    });
  }, []);
}