package com.lorevia.lorevia.services;

import java.util.List;

import com.lorevia.lorevia.models.Personaje;

public interface PersonajeService {
    List<Personaje> findAll();
    Personaje findById(Long id);
    List<Personaje> findByNombre(String nombre);
    Personaje save(Personaje personaje);
    Personaje update(Long id, Personaje personaje);
    void deleteById(Long id);
}
