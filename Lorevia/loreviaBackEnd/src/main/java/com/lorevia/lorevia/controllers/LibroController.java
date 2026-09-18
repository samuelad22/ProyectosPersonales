package com.lorevia.lorevia.controllers;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.lorevia.lorevia.dto.LibroRequest;
import com.lorevia.lorevia.models.Libro;
import com.lorevia.lorevia.services.LibroService;

import jakarta.validation.Valid;


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
    public ResponseEntity<Libro> crear(@Valid @RequestBody LibroRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(libroService.crear(request));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Libro> actualizar(@PathVariable Long id, @Valid @RequestBody LibroRequest request){
        return ResponseEntity.ok(libroService.actualizar(id, request));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id){
        libroService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/{id}/categorias")
    public ResponseEntity<Libro> asignarCategorias(@PathVariable Long id, @RequestBody List<Long> categoriasIds){
        return ResponseEntity.ok(libroService.asignarCategorias(id, categoriasIds));
    }
    @DeleteMapping("/{id}/categorias/{idCategoria}")
    public ResponseEntity<Libro> desasignarCategoria(@PathVariable Long id, @PathVariable Long idCategoria){
        return ResponseEntity.ok(libroService.desasignarCategoria(id, idCategoria));
    }
    @PostMapping("/{id}/personajes")
    public ResponseEntity<Libro> asignarPersonajes(@PathVariable Long id, @RequestBody List<Long> personajesIds){
        return ResponseEntity.ok(libroService.asignarPersonajes(id, personajesIds));
    }
}