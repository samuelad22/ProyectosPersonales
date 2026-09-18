package com.lorevia.lorevia.services;

import java.util.List;

import com.lorevia.lorevia.dto.CategoriaRequest;
import com.lorevia.lorevia.models.Categoria;

public interface CategoriaService {
    List<Categoria> findAll();
    Categoria findById(Long id);
    List<Categoria> findByNombre(String nombre);
    Categoria crear(CategoriaRequest request);
    Categoria actualizar(Long id, CategoriaRequest request);
    void deleteById(Long id);
}