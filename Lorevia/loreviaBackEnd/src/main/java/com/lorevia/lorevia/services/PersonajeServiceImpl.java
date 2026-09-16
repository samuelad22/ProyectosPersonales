package com.lorevia.lorevia.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lorevia.lorevia.Repositories.PersonajeRepository;
import com.lorevia.lorevia.models.Personaje;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PersonajeServiceImpl implements PersonajeService {

    private final PersonajeRepository personajeRepository;

    public PersonajeServiceImpl(PersonajeRepository personajeRepository) {
        this.personajeRepository = personajeRepository;
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
    public Personaje save(Personaje personaje) {
        return personajeRepository.save(personaje);
    }

    @Override
    public Personaje update(Long id, Personaje personaje) {
        Personaje existing = personajeRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Personaje no encontrado"));
        existing.setNombre(personaje.getNombre());
        existing.setInformacionPersonaje(personaje.getInformacionPersonaje());
        return personajeRepository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        personajeRepository.deleteById(id);
    }
}
