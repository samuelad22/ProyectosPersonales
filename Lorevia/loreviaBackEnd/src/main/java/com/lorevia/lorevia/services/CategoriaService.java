package com.lorevia.lorevia.services;

import java.util.List;

import com.lorevia.lorevia.models.Categoria;

public interface CategoriaService {
    List<Categoria> findAll();
    Categoria findById(Long id);
    List<Categoria> findByNombre(String nombre);
    Categoria save(Categoria categoria);
    Categoria update(Long id, Categoria categoria);
    void deleteById(Long id);
}
