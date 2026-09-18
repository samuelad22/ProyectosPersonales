package com.lorevia.lorevia.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lorevia.lorevia.Repositories.CategoriaRepository;
import com.lorevia.lorevia.Repositories.LibroRepository;
import com.lorevia.lorevia.Repositories.PersonajeRepository;
import com.lorevia.lorevia.dto.LibroRequest;
import com.lorevia.lorevia.models.Categoria;
import com.lorevia.lorevia.models.Libro;
import com.lorevia.lorevia.models.Personaje;

import jakarta.persistence.EntityNotFoundException;

@Service 
public class LibroServiceImpl implements LibroService{

    private final LibroRepository libroRepository;
    private final CategoriaRepository categoriaRepository;
    private final PersonajeRepository personajeRepository;
    
    public LibroServiceImpl(LibroRepository libroRepository, CategoriaRepository categoriaRepository,
                            PersonajeRepository personajeRepository){
        this.libroRepository = libroRepository;
        this.categoriaRepository = categoriaRepository;
        this.personajeRepository = personajeRepository;
    }

    @Override
    public List<Libro> findAll() {
        return libroRepository.findAllConRelaciones();
    }

    @Override
    public List<Libro> findByNombreContaining(String nombre) {
        return libroRepository.findByNombreContainingConRelaciones(nombre);
    }

    @Override
    public List<Libro> findByCategoriasNombre(String nombre) {
        return libroRepository.findByCategoriasNombreConRelaciones(nombre);
    }

    @Override
    public Libro findById(Long id) {
        return libroRepository.findByIdConRelaciones(id).orElseThrow(() -> new EntityNotFoundException("Libro no encontrado"));
    }

    @Override
    @Transactional
    public Libro crear(LibroRequest request) {
        Libro libro = new Libro();
        libro.setNombre(request.nombre());
        libro.setSinopsis(request.sinopsis());
        Libro guardado = libroRepository.save(libro);
        aplicarCategorias(guardado, request.categoriasIds());
        aplicarPersonajes(guardado, request.personajesIds());
        return guardado;
    }

    @Override
    @Transactional
    public Libro actualizar(Long id, LibroRequest request) {
        Libro existing = libroRepository.findByIdConRelaciones(id).orElseThrow(() -> new EntityNotFoundException("Libro no encontrado"));
        existing.setNombre(request.nombre());
        existing.setSinopsis(request.sinopsis());
        aplicarCategorias(existing, request.categoriasIds());
        aplicarPersonajes(existing, request.personajesIds());
        return existing;
    }

    @Override
    @Transactional
    public Libro asignarCategorias(Long id, List<Long> categoriasIds) {
        Libro libro = libroRepository.findByIdConRelaciones(id).orElseThrow(() -> new EntityNotFoundException("Libro no encontrado"));
        if (categoriasIds != null) {
            for (Long idCategoria : categoriasIds) {
                Categoria categoria = categoriaRepository.findById(idCategoria)
                        .orElseThrow(() -> new EntityNotFoundException("Categoria no encontrada: " + idCategoria));
                if (libro.getCategorias().add(categoria)) {
                    categoria.getLibros().add(libro);
                }
            }
        }
        return libro;
    }

    @Override
    @Transactional
    public Libro desasignarCategoria(Long id, Long idCategoria) {
        Libro libro = libroRepository.findByIdConRelaciones(id).orElseThrow(() -> new EntityNotFoundException("Libro no encontrado"));
        Categoria categoria = categoriaRepository.findById(idCategoria)
                .orElseThrow(() -> new EntityNotFoundException("Categoria no encontrada: " + idCategoria));
        if (libro.getCategorias().remove(categoria)) {
            categoria.getLibros().remove(libro);
        }
        return libro;
    }

    @Override
    @Transactional
    public Libro asignarPersonajes(Long id, List<Long> personajesIds) {
        Libro libro = libroRepository.findByIdConRelaciones(id).orElseThrow(() -> new EntityNotFoundException("Libro no encontrado"));
        if (personajesIds != null) {
            for (Long idPersonaje : personajesIds) {
                Personaje personaje = personajeRepository.findById(idPersonaje)
                        .orElseThrow(() -> new EntityNotFoundException("Personaje no encontrado: " + idPersonaje));
                if (libro.getPersonajes().add(personaje)) {
                    personaje.getLibros().add(libro);
                }
            }
        }
        return libro;
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        Libro libro = libroRepository.findByIdConRelaciones(id).orElseThrow(() -> new EntityNotFoundException("Libro no encontrado"));
        for (Categoria categoria : new ArrayList<>(libro.getCategorias())) {
            categoria.getLibros().remove(libro);
        }
        for (Personaje personaje : new ArrayList<>(libro.getPersonajes())) {
            personaje.getLibros().remove(libro);
        }
        libroRepository.delete(libro);
    }

    private void aplicarCategorias(Libro libro, List<Long> categoriasIds) {
        if (categoriasIds == null) {
            return;
        }
        List<Categoria> nuevas = new ArrayList<>();
        for (Long idCategoria : categoriasIds) {
            Categoria categoria = categoriaRepository.findById(idCategoria)
                    .orElseThrow(() -> new EntityNotFoundException("Categoria no encontrada: " + idCategoria));
            nuevas.add(categoria);
        }
        for (Categoria categoria : new ArrayList<>(libro.getCategorias())) {
            categoria.getLibros().remove(libro);
        }
        libro.getCategorias().clear();
        for (Categoria categoria : nuevas) {
            categoria.getLibros().add(libro);
            libro.getCategorias().add(categoria);
        }
    }

    private void aplicarPersonajes(Libro libro, List<Long> personajesIds) {
        if (personajesIds == null) {
            return;
        }
        List<Personaje> nuevos = new ArrayList<>();
        for (Long idPersonaje : personajesIds) {
            Personaje personaje = personajeRepository.findById(idPersonaje)
                    .orElseThrow(() -> new EntityNotFoundException("Personaje no encontrado: " + idPersonaje));
            nuevos.add(personaje);
        }
        for (Personaje personaje : new ArrayList<>(libro.getPersonajes())) {
            personaje.getLibros().remove(libro);
        }
        libro.getPersonajes().clear();
        for (Personaje personaje : nuevos) {
            personaje.getLibros().add(libro);
            libro.getPersonajes().add(personaje);
        }
    }
}