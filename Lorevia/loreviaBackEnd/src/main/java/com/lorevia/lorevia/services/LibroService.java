package com.lorevia.lorevia.services;

import java.util.List;

import com.lorevia.lorevia.models.Libro;

public interface LibroService {
    List<Libro> findAll();
    List<Libro> findByNombreContaining(String nombre);
    List<Libro> findByCategoriasNombre(String nombre);
    Libro findById(Long id); 
    Libro save(Libro libro);
    Libro update(Long id, Libro libro);
    void deleteById(Long id);
    
}
