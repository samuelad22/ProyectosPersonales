package com.lorevia.lorevia.services;

import java.util.List;

import com.lorevia.lorevia.models.Parentesco;
import com.lorevia.lorevia.models.Personaje;

public interface ParentescoService {
    List<Parentesco> findAll();
    Parentesco findById(Long id);
    List<Parentesco> findByPersonaje(Long id);
    List<Parentesco> findByPersonajes(Long idOrigen, Long idDestino);
    Parentesco save(Parentesco parentesco);
    Parentesco update(Long id, Parentesco parentesco);
    void deleteById(Long id);
}
