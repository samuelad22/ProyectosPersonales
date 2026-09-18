package com.lorevia.lorevia.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lorevia.lorevia.Repositories.CategoriaRepository;
import com.lorevia.lorevia.dto.CategoriaRequest;
import com.lorevia.lorevia.models.Categoria;

import jakarta.persistence.EntityNotFoundException;

@Service
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaServiceImpl(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public List<Categoria> findAll() {
        return categoriaRepository.findAll();
    }

    @Override
    public Categoria findById(Long id) {
        return categoriaRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Categoria no encontrada"));
    }

    @Override
    public List<Categoria> findByNombre(String nombre) {
        return categoriaRepository.findByNombre(nombre);
    }

    @Override
    public Categoria crear(CategoriaRequest request) {
        Categoria categoria = new Categoria();
        categoria.setNombre(request.nombre());
        categoria.setDescripcion(request.descripcion());
        return categoriaRepository.save(categoria);
    }

    @Override
    public Categoria actualizar(Long id, CategoriaRequest request) {
        Categoria existing = categoriaRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Categoria no encontrada"));
        existing.setNombre(request.nombre());
        existing.setDescripcion(request.descripcion());
        return categoriaRepository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        categoriaRepository.deleteById(id);
    }
}