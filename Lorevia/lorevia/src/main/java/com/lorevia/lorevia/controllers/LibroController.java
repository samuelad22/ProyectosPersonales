package com.lorevia.lorevia.controllers;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.lorevia.lorevia.models.Libro;
import com.lorevia.lorevia.services.LibroService;


@Controller
@RequestMapping ("/api/libros")
public class LibroController {

    private final LibroService libroService;

    public LibroController(LibroService libroService){
        this.libroService = libroService;
    }
    @GetMapping
    public ResponseEntity<List<Libro>> findAll(){
        return ResponseEntity.ok(libroService.findAll());
    }
    @GetMapping("/buscar")
    public ResponseEntity<List<Libro>> buscarPorNombre(@RequestParam String nombre){
        return ResponseEntity.ok(libroService.findByNombreContaining(nombre));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Libro> findById(@PathVariable Long id){
        return ResponseEntity.ok(libroService.findById(id));
    }
    @PostMapping
    public ResponseEntity<Libro> save(@RequestBody Libro libro){
        return ResponseEntity.status(HttpStatus.CREATED).body(libroService.save(libro));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Libro> update(@PathVariable Long id, @RequestBody Libro libro){
        return ResponseEntity.ok(libroService.update(id, libro));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id){
        libroService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
