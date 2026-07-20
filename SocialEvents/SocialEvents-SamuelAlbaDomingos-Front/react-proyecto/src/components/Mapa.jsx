function Mapa({ubicacion}) {
    const src = `https://maps.google.com/maps?q=${encodeURIComponent(ubicacion)}&output=embed`

    return (
        <div className="map-wrapper ">
        <iframe 
            src={src}
className="map-iframe"
            ></iframe>
            </div>
    )
}
export default Mapa