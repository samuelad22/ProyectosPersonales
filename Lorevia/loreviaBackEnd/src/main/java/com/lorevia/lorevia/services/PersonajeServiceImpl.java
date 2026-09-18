package com.lorevia.lorevia.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lorevia.lorevia.Repositories.LibroRepository;
import com.lorevia.lorevia.Repositories.PersonajeRepository;
import com.lorevia.lorevia.dto.PersonajeRequest;
import com.lorevia.lorevia.models.InformacionPersonaje;
import com.lorevia.lorevia.models.Libro;
import com.lorevia.lorevia.models.Personaje;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PersonajeServiceImpl implements PersonajeService {

    private final PersonajeRepository personajeRepository;
    private final LibroRepository libroRepository;

    public PersonajeServiceImpl(PersonajeRepository personajeRepository, LibroRepository libroRepository) {
        this.personajeRepository = personajeRepository;
        this.libroRepository = libroRepository;
    }

    @Override
    public List<Personaje> findAll() {
        return personajeRepository.findAll();
    }

    @Override
    public Personaje findById(Long id) {
        return personajeRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Personaje no encontrado"));
    }

    @Override
    public List<Personaje> findByNombre(String nombre) {
        return personajeRepository.getPersonajesByNombre(nombre);
    }

    @Override
    @Transactional
    public Personaje crear(PersonajeRequest request) {
        Personaje personaje = new Personaje();
        personaje.setNombre(request.nombre());
        personaje.setInformacionPersonaje(crearInformacion(request));
        Personaje guardado = personajeRepository.save(personaje);
        aplicarLibros(guardado, request.librosIds());
        return guardado;
    }

    @Override
    @Transactional
    public Personaje actualizar(Long id, PersonajeRequest request) {
        Personaje existing = personajeRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Personaje no encontrado"));
        existing.setNombre(request.nombre());
        if (existing.getInformacionPersonaje() == null) {
            existing.setInformacionPersonaje(new InformacionPersonaje());
        }
        InformacionPersonaje informacion = existing.getInformacionPersonaje();
        informacion.setLugarOrigen(request.lugarOrigen());
        informacion.setFechaNacimiento(request.fechaNacimiento());
        informacion.setFechaMuerte(request.fechaMuerte());
        aplicarLibros(existing, request.librosIds());
        return existing;
    }

    @Override
    @Transactional
    public Personaje asignarLibros(Long id, List<Long> librosIds) {
        Personaje personaje = personajeRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Personaje no encontrado"));
        aplicarLibros(personaje, librosIds);
        return personaje;
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        Personaje personaje = personajeRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Personaje no encontrado"));
        for (Libro libro : new ArrayList<>(personaje.getLibros())) {
            libro.getPersonajes().remove(personaje);
        }
        personaje.getLibros().clear();
        personajeRepository.delete(personaje);
    }

    private InformacionPersonaje crearInformacion(PersonajeRequest request) {
        InformacionPersonaje informacion = new InformacionPersonaje();
        informacion.setLugarOrigen(request.lugarOrigen());
        informacion.setFechaNacimiento(request.fechaNacimiento());
        informacion.setFechaMuerte(request.fechaMuerte());
        return informacion;
    }

    private void aplicarLibros(Personaje personaje, List<Long> librosIds) {
        if (librosIds == null) {
            return;
        }
        for (Libro libro : new ArrayList<>(personaje.getLibros())) {
            libro.getPersonajes().remove(personaje);
        }
        personaje.getLibros().clear();
        for (Long idLibro : librosIds) {
            Libro libro = libroRepository.findByIdConRelaciones(idLibro)
                    .orElseThrow(() -> new EntityNotFoundException("Libro no encontrado: " + idLibro));
            if (personaje.getLibros().add(libro)) {
                libro.getPersonajes().add(personaje);
            }
        }
    }
}