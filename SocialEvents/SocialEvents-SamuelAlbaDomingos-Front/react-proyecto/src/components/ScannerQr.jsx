import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

function QRScanner() {
  const apiUrlBase = import.meta.env.VITE_API_URL;
  const enviando = useRef(false);
  const lectorRef = useRef(null);
  const inputArchivoRef = useRef(null);
  const camaraActivaRef = useRef(false);
  const [escaneando, setEscaneando] = useState(true);
  const [camaraActiva, setCamaraActiva] = useState(false);
  const [estado, setEstado] = useState(null);
  const [datosEntrada, setDatosEntrada] = useState(null);

  const limpiarLector = () => {
    if (!lectorRef.current) return;
    try {
      lectorRef.current.clear();
    } catch (error) {
      console.debug("No se pudo limpiar el lector:", error);
    }
  };

  const detenerLector = async () => {
    if (!lectorRef.current) return;
    try {
      const resultado = lectorRef.current.stop();
      if (resultado?.catch) await resultado;
    } catch (error) {
      console.debug("Lector QR ya detenido:", error);
    }
  };

  const validarQr = async (resultado) => {
    if (enviando.current) return;
    enviando.current = true;

    try {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      const token = usuario?.token;
      const respuesta = await fetch(
        apiUrlBase + "/validarEntrada/" + encodeURIComponent(resultado),
        { method: "GET", headers: { Authorization: "Bearer " + token } },
      );

      const data = await respuesta.json();
      const datos = data.data ? data.data : data;
      const nuevoEstado = respuesta.ok
        ? "valida"
        : respuesta.status == 400
          ? "usada"
          : respuesta.status == 404
            ? "no-encontrada"
            : "error";

      setDatosEntrada(datos);
      setEstado(nuevoEstado);

      setEscaneando(false);
    } catch (error) {
      console.error(error);
      setEstado("error");
      setEscaneando(false);
    } finally {
      enviando.current = false;
    }
  };

  useEffect(() => {
    if (!lectorRef.current) {
      lectorRef.current = new Html5Qrcode("qr-reader");
    }

    return () => {
      if (!lectorRef.current) return;
      if (camaraActivaRef.current) {
        detenerLector().finally(() => limpiarLector());
        return;
      }
      limpiarLector();
    };
  }, []);

  const detenerCamara = async () => {
    if (!lectorRef.current || !camaraActivaRef.current) return;
    await detenerLector();
    limpiarLector();
    setCamaraActiva(false);
    camaraActivaRef.current = false;
  };

  const iniciarCamara = async () => {
    if (!lectorRef.current) return;

    try {
      const dispositivos = await Html5Qrcode.getCameras();
      const cameraId = dispositivos?.[0]?.id;
      const config = { fps: 30, qrbox: { width: 250, height: 250 } };
      const cameraConfig = cameraId
        ? { deviceId: { exact: cameraId } }
        : { facingMode: "environment" };

      await lectorRef.current.start(
        cameraConfig,
        config,
        (resultado) => {
          detenerCamara().finally(() => {
            validarQr(resultado);
          });
        },
        (error) => {
          console.debug("Sin QR detectado:", error);
        },
      );

      setCamaraActiva(true);
      camaraActivaRef.current = true;
    } catch (error) {
      console.error("No se pudo iniciar la camara:", error);
      setCamaraActiva(false);
      camaraActivaRef.current = false;
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !lectorRef.current) return;

    if (camaraActiva) {
      await detenerCamara();
    }

    try {
      const resultado = await lectorRef.current.scanFile(file, true);
      await validarQr(resultado);
    } catch (error) {
      console.error("No se pudo leer el QR del archivo:", error);
    } finally {
      if (event.target) event.target.value = "";
    }
  };

  const volverAEscanear = () => {
    setEstado(null);
    setDatosEntrada(null);
    setEscaneando(true);
    if (inputArchivoRef.current) inputArchivoRef.current.value = "";
  };

  const numeroPersonas = datosEntrada?.numeroPersonas ?? "-";
  const emailAsociado =
    datosEntrada?.emailAsociado ?? datosEntrada?.emailAdociado ?? "-";
  const usuario = datosEntrada?.usuario ?? null;
  const evento = datosEntrada?.evento ?? null;
  const categoria = evento?.categoria ?? null;
  const codigo = datosEntrada?.codigo ?? datosEntrada?.code ?? "-";
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  return (
    <div className="qr-page">
      <main className="qr-shell">
        <section className="qr-panel">
          <header className="qr-header">
            <div>
              <p className="qr-eyebrow">Control de accesos</p>
              <h1 className="qr-title">Scanner QR</h1>
            </div>
            {!escaneando && (
              <button className="qr-button" onClick={volverAEscanear}>
                Escanear otro
              </button>
            )}
          </header>

          <div className="qr-body">
            <div className="qr-scanner">
              <div
                id="qr-reader"
                className={
                  escaneando ? "qr-reader" : "qr-reader qr-reader--inactive"
                }
              >
                {!escaneando && (
                  <div className="qr-reader-placeholder">
                    <p>Escaneo detenido</p>
                    <span>Sube una imagen o inicia otro escaneo</span>
                  </div>
                )}
              </div>

              <div className="qr-controls">
                <div className="qr-actions">
                  {!camaraActiva ? (
                    <button
                      className="qr-action"
                      onClick={iniciarCamara}
                      disabled={!escaneando}
                    >
                      Iniciar camara
                    </button>
                  ) : (
                    <button className="qr-action" onClick={detenerCamara}>
                      Detener camara
                    </button>
                  )}

                  <label className="qr-file">
                    <input
                      className="qr-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={!escaneando}
                      ref={inputArchivoRef}
                    />
                    <span className="qr-action qr-action--secondary">
                      Subir imagen
                    </span>
                  </label>
                </div>

                <div className="qr-status-pill">
                  {camaraActiva ? "Camara activa" : "Camara apagada"}
                </div>
              </div>
              <p className="qr-hint">
                Puedes usar la camara o subir una imagen desde el lector.
              </p>
            </div>

            <div className="qr-status">
              {escaneando && (
                <div className="qr-card qr-card--info">
                  <p className="qr-card-title">Listo para leer</p>
                  <p className="qr-card-text">
                    Apunta el codigo dentro del marco o sube un PNG/JPG desde
                    el lector.
                  </p>
                </div>
              )}

              {estado == "valida" && (
                <div className="qr-card qr-card--success">
                  <p className="qr-card-title">Entrada valida</p>
                  <p className="qr-card-text">
                    Entrada verificada correctamente.
                  </p>

                  <div className="qr-grid">
                    <div className="qr-stat">
                      <span className="qr-stat-label">Personas</span>
                      <span className="qr-stat-value">{numeroPersonas}</span>
                    </div>
                    <div className="qr-stat">
                      <span className="qr-stat-label">Email asociado</span>
                      <span className="qr-stat-value">{emailAsociado}</span>
                    </div>
                  </div>

                  {usuario && (
                    <div className="qr-block">
                      <p className="qr-block-title">Usuario</p>
                      <div className="qr-block-body">
                        <div>
                          <span className="qr-muted">ID</span>
                          <strong>{usuario.id}</strong>
                        </div>
                        <div>
                          <span className="qr-muted">Nombre</span>
                          <strong>{usuario.nombre}</strong>
                        </div>
                        <div>
                          <span className="qr-muted">Email</span>
                          <strong>{usuario.email}</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {evento && (
                    <div className="qr-block">
                      <p className="qr-block-title">Evento</p>
                      <div className="qr-block-body">
                        <div>
                          <span className="qr-muted">ID</span>
                          <strong>{evento.id}</strong>
                        </div>
                        <div>
                          <span className="qr-muted">Nombre</span>
                          <strong>{evento.nombre}</strong>
                        </div>
                        <div className="qr-category">
                          <span
                            className="qr-category-dot"
                            style={{
                              backgroundColor:
                                categoria?.color || "var(--color-cyan)",
                            }}
                          />
                          <span>{categoria?.nombre || "Sin categoria"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {estado == "usada" && (
                <div className="qr-card qr-card--warning">
                  <p className="qr-card-title">Entrada ya usada</p>
                  <p className="qr-card-text">
                    Esta entrada ya fue registrada previamente el {formatearFecha(datosEntrada?.ultimoUso) || "desconocida"}
                  </p>
                  {usuario && (
                    <div className="qr-block-body">
                      <div>
                        <span className="qr-muted">Ultimo uso</span>
                        <strong>{usuario.nombre}</strong>
                      </div>
                      <div>
                        <span className="qr-muted">Email</span>
                        <strong>{usuario.email}</strong>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {estado == "no-encontrada" && (
                <div className="qr-card qr-card--danger">
                  <p className="qr-card-title">Entrada no encontrada</p>
                  <p className="qr-card-text">Codigo no registrado.</p>
                  <div className="qr-code">
                    <span>Codigo</span>
                    <strong>{codigo}</strong>
                  </div>
                </div>
              )}

              {estado == "error" && (
                <div className="qr-card qr-card--danger">
                  <p className="qr-card-title">Error al validar</p>
                  <p className="qr-card-text">
                    No se pudo validar la entrada. Intenta otra vez.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default QRScanner;