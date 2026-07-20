
import {Link} from 'react-router-dom'
function Footer() {


    return( 
       <footer id="footer">
    <div id="footer-nav">
        <Link to="/">Inicio</Link>
        <Link to="/eventos">Eventos</Link>
        <Link to="/crearEvento">Crear evento</Link>
    </div>

    <p id="footer-creditos">© 2026 Social Events -- Samuel Alba -- IES Monte Naranco</p>
</footer>
    )
}
export default Footer