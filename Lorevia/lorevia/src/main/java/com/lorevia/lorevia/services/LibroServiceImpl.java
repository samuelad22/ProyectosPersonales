package com.lorevia.lorevia.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lorevia.lorevia.Repositories.LibroRepository;
import com.lorevia.lorevia.models.Libro;

import jakarta.persistence.EntityNotFoundException;

@Service 
public class LibroServiceImpl implements LibroService{


    private final LibroRepository libroRepository;
    
    public LibroServiceImpl(LibroRepository libroRepository){
        this.libroRepository = libroRepository;
    }

    @Override
    public List<Libro> findAll() {
        return libroRepository.findAll();
    }

    @Override
    public List<Libro> findByNombreContaining(String nombre) {
        return libroRepository.findByNombreContaining(nombre);
    }

    @Override
    public List<Libro> findByCategoriaId(Long idCategoria) {
        return libroRepository.findByCategoriaId(idCategoria);
    }

    @Override
    public Libro findById(Long id) {
        return libroRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Libro no encontrado"));
    }

    @Override
    public Libro save(Libro libro) {
        return libroRepository.save(libro);
    }

    @Override
    public Libro update(Long id, Libro libro) {
        Libro existing = libroRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Libro no encontrado"));
        existing.setNombre(libro.getNombre());
        existing.setSinopsis(libro.getSinopsis());
        existing.setCategoria(libro.getCategoria());
        existing.setAutor(libro.getAutor());
        return libroRepository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        libroRepository.deleteById(id);
    }

}
