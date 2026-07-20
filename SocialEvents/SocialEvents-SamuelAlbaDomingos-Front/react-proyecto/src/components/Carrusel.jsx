import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useNavigate } from 'react-router-dom';

function CarruselEventos({ eventos, numeroSlides }) {
    const navigate = useNavigate();
   

      const verDetalleEvento = (id) => {
    navigate(`/eventos/eventoDetalle/${id}`);
  };

    return (
        <Swiper
          key={eventos.length}
          modules={[Autoplay, FreeMode]}
          slidesPerView={numeroSlides}
          spaceBetween={16}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 1900,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
        >
            {eventos.map(evento => (
                <SwiperSlide key={evento.id} onClick={() => verDetalleEvento(evento.id)}>
                   <div className={"card " + evento.categoria.color}>
                <img src={evento.imagen} alt={evento.nombre} />
                <div className="card-overlay">
                  <p className="card-nombre">{evento.nombre}</p>
                </div>
              </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default CarruselEventos;