package com.lorevia.lorevia.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lorevia.lorevia.models.Parentesco;
import com.lorevia.lorevia.models.Personaje;
import java.util.List;
public interface ParentescoRepository extends JpaRepository<Parentesco, Long> {
    List<Parentesco> findByPersonajeDestinoOrPersonajeOrigen(Personaje personajeDestino, Personaje personajeOrigen);
    List<Parentesco> findByPersonajeDestino(Personaje personajeDestino);
    List<Parentesco> findByPersonajeOrigen(Personaje personajeOrigen);
}
