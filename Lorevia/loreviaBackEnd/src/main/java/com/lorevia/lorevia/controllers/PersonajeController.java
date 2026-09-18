package com.lorevia.lorevia.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.lorevia.lorevia.dto.PersonajeRequest;
import com.lorevia.lorevia.models.Personaje;
import com.lorevia.lorevia.services.PersonajeService;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/api/personajes")
public class PersonajeController {

    private final PersonajeService personajeService;

    public PersonajeController(PersonajeService personajeService) {
        this.personajeService = personajeService;
    }

    @GetMapping
    public ResponseEntity<List<Personaje>> findAll() {
        return ResponseEntity.ok(personajeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Personaje> findById(@PathVariable Long id) {
        return ResponseEntity.ok(personajeService.findById(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Personaje>> findByNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(personajeService.findByNombre(nombre));
    }

    @PostMapping
    public ResponseEntity<Personaje> crear(@Valid @RequestBody PersonajeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(personajeService.crear(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Personaje> actualizar(@PathVariable Long id, @Valid @RequestBody PersonajeRequest request) {
        return ResponseEntity.ok(personajeService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        personajeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/libros")
    public ResponseEntity<Personaje> asignarLibros(@PathVariable Long id, @RequestBody List<Long> librosIds) {
        return ResponseEntity.ok(personajeService.asignarLibros(id, librosIds));
    }
}