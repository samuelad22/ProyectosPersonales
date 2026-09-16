package com.lorevia.lorevia.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.lorevia.lorevia.models.Personaje;
import com.lorevia.lorevia.services.PersonajeService;

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
    public ResponseEntity<Personaje> save(@RequestBody Personaje personaje) {
        return ResponseEntity.status(HttpStatus.CREATED).body(personajeService.save(personaje));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Personaje> update(@PathVariable Long id, @RequestBody Personaje personaje) {
        return ResponseEntity.ok(personajeService.update(id, personaje));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        personajeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
