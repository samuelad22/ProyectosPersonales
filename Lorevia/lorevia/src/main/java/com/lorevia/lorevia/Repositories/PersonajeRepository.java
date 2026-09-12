package com.lorevia.lorevia.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lorevia.lorevia.models.Personaje;
import java.util.List;
public interface PersonajeRepository extends JpaRepository<Personaje, Long> {
    List<Personaje> getPersonajesByNombre(String nombre);
}
