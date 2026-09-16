package com.lorevia.lorevia.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lorevia.lorevia.Repositories.CategoriaRepository;
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
    public Categoria save(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    @Override
    public Categoria update(Long id, Categoria categoria) {
        Categoria existing = categoriaRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Categoria no encontrada"));
        existing.setNombre(categoria.getNombre());
        existing.setDescripcion(categoria.getDescripcion());
        return categoriaRepository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        categoriaRepository.deleteById(id);
    }
}
