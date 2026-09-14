package com.lorevia.lorevia.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lorevia.lorevia.Repositories.ParentescoRepository;
import com.lorevia.lorevia.Repositories.PersonajeRepository;
import com.lorevia.lorevia.models.Parentesco;
import com.lorevia.lorevia.models.Personaje;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ParentescoServiceImpl implements ParentescoService {

    private final ParentescoRepository parentescoRepository;
    private final PersonajeRepository personajeRepository;

    public ParentescoServiceImpl(ParentescoRepository parentescoRepository, PersonajeRepository personajeRepository) {
        this.parentescoRepository = parentescoRepository;
        this.personajeRepository = personajeRepository;
    }

    @Override
    public List<Parentesco> findAll() {
        return parentescoRepository.findAll();
    }

    @Override
    public Parentesco findById(Long id) {
        return parentescoRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Parentesco no encontrado"));
    }

    @Override
    public List<Parentesco> findByPersonaje(Long id) {
        Personaje personaje = personajeRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Personaje no encontrado"));
        return parentescoRepository.findByPersonajeDestinoOrPersonajeOrigen(personaje, personaje);
    }

    @Override
    public List<Parentesco> findByPersonajes(Long idOrigen, Long idDestino) {
        Personaje origen = personajeRepository.findById(idOrigen).orElseThrow(() -> new EntityNotFoundException("Personaje origen no encontrado"));
        Personaje destino = personajeRepository.findById(idDestino).orElseThrow(() -> new EntityNotFoundException("Personaje destino no encontrado"));
        List<Parentesco> porOrigen = parentescoRepository.findByPersonajeOrigen(origen);
        List<Parentesco> porDestino = parentescoRepository.findByPersonajeDestino(destino);
        List<Parentesco> resultado = new java.util.ArrayList<>(porOrigen);
        resultado.retainAll(porDestino);
        return resultado;
    }

    @Override
    public Parentesco save(Parentesco parentesco) {
        return parentescoRepository.save(parentesco);
    }

    @Override
    public Parentesco update(Long id, Parentesco parentesco) {
        Parentesco existing = parentescoRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Parentesco no encontrado"));
        existing.setPersonajeOrigen(parentesco.getPersonajeOrigen());
        existing.setPersonajeDestino(parentesco.getPersonajeDestino());
        existing.setTipoParentesco(parentesco.getTipoParentesco());
        return parentescoRepository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        parentescoRepository.deleteById(id);
    }
}
