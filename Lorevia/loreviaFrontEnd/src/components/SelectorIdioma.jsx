import { useState } from 'react'
import { useIdioma } from '../context/IdiomaContext'

function SelectorIdioma() {
  const { idioma, cambiarIdioma, t } = useIdioma()
  const [toogleAbierto, setToogleAbierto] = useState(false)

  const cambiarEstadoToogle = () => {
    setToogleAbierto((prev) => !prev)
  }

  return (
    <div className='contenedor-toogle-idioma'>
      <button type="button" className={toogleAbierto == false ? '' : 'toogle'} onClick={cambiarEstadoToogle}> <img src= {idioma == "es" ? "https://flagcdn.com/es.svg" : "https://flagcdn.com/gb-eng.svg"} alt="Bandera de España" className="pais-bandera-foto" /> <span>{idioma == "es" ? "Español" : "English"}</span> </button>
      <div className={toogleAbierto == false ? 'toogle' : ''}>
        <div className="selector-idioma">
          <div className="idioma" onClick={() => {cambiarIdioma('es'); setToogleAbierto(false)}}>
            <img src="https://flagcdn.com/es.svg" alt="Bandera de España" className="pais-bandera-foto" />
            <span>Español</span>
          </div>
          <div className="idioma" onClick={() => {cambiarIdioma('en'); setToogleAbierto(false)}}>
            <img src="https://flagcdn.com/gb-eng.svg" alt="Bandera de Reino Unido" className="pais-bandera-foto" />
            <span>English</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectorIdioma