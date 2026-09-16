package com.lorevia.lorevia.Repositories;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lorevia.lorevia.models.Categoria;


public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findByNombre(String nombre);
}
