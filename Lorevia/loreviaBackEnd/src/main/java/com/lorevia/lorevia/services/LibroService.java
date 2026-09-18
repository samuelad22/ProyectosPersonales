package com.lorevia.lorevia.services;

import java.util.List;

import com.lorevia.lorevia.dto.LibroRequest;
import com.lorevia.lorevia.models.Libro;

public interface LibroService {
    List<Libro> findAll();
    List<Libro> findByNombreContaining(String nombre);
    List<Libro> findByCategoriasNombre(String nombre);
    Libro findById(Long id); 
    Libro crear(LibroRequest request);
    Libro actualizar(Long id, LibroRequest request);
    Libro asignarCategorias(Long id, List<Long> categoriasIds);
    Libro desasignarCategoria(Long id, Long idCategoria);
    Libro asignarPersonajes(Long id, List<Long> personajesIds);
    void deleteById(Long id);
}