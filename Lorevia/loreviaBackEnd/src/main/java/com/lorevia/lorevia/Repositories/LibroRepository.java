package com.lorevia.lorevia.Repositories;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.lorevia.lorevia.models.Libro;

public interface LibroRepository extends JpaRepository<Libro, Long>{
    @EntityGraph(attributePaths = {"categorias", "personajes", "autor"})
    @Query("select distinct l from Libro l")
    List<Libro> findAllConRelaciones();

    @EntityGraph(attributePaths = {"categorias", "personajes", "autor"})
    @Query("select distinct l from Libro l where l.nombre like concat('%', :nombre, '%')")
    List<Libro> findByNombreContainingConRelaciones(@Param("nombre") String nombre);

    @EntityGraph(attributePaths = {"categorias", "personajes", "autor"})
    @Query("select distinct l from Libro l join l.categorias c where c.nombre = :nombre")
    List<Libro> findByCategoriasNombreConRelaciones(@Param("nombre") String nombre);

    @EntityGraph(attributePaths = {"categorias", "personajes", "autor"})
    @Query("select distinct l from Libro l where l.id = :id")
    Optional<Libro> findByIdConRelaciones(@Param("id") Long id);
}