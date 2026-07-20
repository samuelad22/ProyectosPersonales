import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import { useNavigate } from 'react-router-dom'
import Navbar from './NavBar'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { useComprobarVeto } from './useComprobarVeto';

function Calendario() {

  useComprobarVeto();

  const [diaSeleccionado, setDiaSeleccionado] = useState(null)
  const [eventosDelDia, setEventosDelDia] = useState([])
  const [eventos, setEventos] = useState([])
  const navigate = useNavigate()
  const eventosUrl = import.meta.env.VITE_API_URL + "/eventos"

  useEffect(() => {
    fetch(eventosUrl)
      .then(res => res.json())
      .then(data => setEventos(data.data))
  }, [])

  const mapa = {}
  eventos.forEach(evento => {
    if (!mapa[evento.fechaInicio]) {
      mapa[evento.fechaInicio] = []
    }
    mapa[evento.fechaInicio].push(evento)
  })

  function handleClick(date) {
    const key = date.toLocaleDateString('en-CA')
    setDiaSeleccionado(date)
    setEventosDelDia(mapa[key] || [])
  }
    const verDetalleEvento = (id) => {
    navigate(`/eventos/eventoDetalle/${id}`);
  };

  return (<div >
  <Navbar />
  <div className="calendar-wrapper">
  <Calendar
    locale="es-ES"
    onClickDay={handleClick}
    value={diaSeleccionado}
    tileContent={({ date }) => {
      const evs = mapa[date.toLocaleDateString('en-CA')] || []
      if (evs.length === 0) return null
      return (
        <div className="cal-dots">
          {evs.slice(0, 3).map((ev) => (
            <span key={ev.id} className="cal-dot" />
          ))}
        </div>
      )
    }}
  />

  {diaSeleccionado && eventosDelDia.length > 0 && (
    <div className="eventos-del-dia">
      {eventosDelDia.map(ev => (
        <div
          key={ev.id}
          className="evento-card"
          onClick={() => verDetalleEvento(ev.id)}
        >
          <FontAwesomeIcon icon={faCircle} className="evento-card-icon" />
          <p className="evento-card-nombre">{ev.nombre}</p>
        </div>
      ))}
    </div>
  )}
  </div>
</div>)
}

export default Calendario