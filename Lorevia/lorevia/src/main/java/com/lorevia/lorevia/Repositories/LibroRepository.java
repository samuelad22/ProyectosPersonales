package com.lorevia.lorevia.Repositories;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lorevia.lorevia.models.Libro;

public interface LibroRepository extends JpaRepository<Libro, Long>{
    List<Libro> findByNombreContaining(String nombre);
    List<Libro> findByCategoriaId(Long idCategoria);
}
