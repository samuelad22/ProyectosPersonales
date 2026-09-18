package com.lorevia.lorevia.services;

import java.util.List;

import com.lorevia.lorevia.dto.PersonajeRequest;
import com.lorevia.lorevia.models.Personaje;

public interface PersonajeService {
    List<Personaje> findAll();
    Personaje findById(Long id);
    List<Personaje> findByNombre(String nombre);
    Personaje crear(PersonajeRequest request);
    Personaje actualizar(Long id, PersonajeRequest request);
    Personaje asignarLibros(Long id, List<Long> librosIds);
    void deleteById(Long id);
}