package com.lorevia.lorevia.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.lorevia.lorevia.models.Parentesco;
import com.lorevia.lorevia.services.ParentescoService;

@Controller
@RequestMapping("/api/parentescos")
public class ParentescoController {

    private final ParentescoService parentescoService;

    public ParentescoController(ParentescoService parentescoService) {
        this.parentescoService = parentescoService;
    }

    @GetMapping
    public ResponseEntity<List<Parentesco>> findAll() {
        return ResponseEntity.ok(parentescoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Parentesco> findById(@PathVariable Long id) {
        return ResponseEntity.ok(parentescoService.findById(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Parentesco>> findByPersonaje(@RequestParam Long idPersonaje) {
        return ResponseEntity.ok(parentescoService.findByPersonaje(idPersonaje));
    }

    @GetMapping("/buscar/entre")
    public ResponseEntity<List<Parentesco>> findByPersonajes(@RequestParam Long idOrigen, @RequestParam Long idDestino) {
        return ResponseEntity.ok(parentescoService.findByPersonajes(idOrigen, idDestino));
    }

    @PostMapping
    public ResponseEntity<Parentesco> save(@RequestBody Parentesco parentesco) {
        return ResponseEntity.status(HttpStatus.CREATED).body(parentescoService.save(parentesco));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Parentesco> update(@PathVariable Long id, @RequestBody Parentesco parentesco) {
        return ResponseEntity.ok(parentescoService.update(id, parentesco));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        parentescoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
