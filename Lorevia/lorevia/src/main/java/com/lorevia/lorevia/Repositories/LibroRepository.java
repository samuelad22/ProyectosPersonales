package com.lorevia.lorevia.Repositories;
import com.lorevia.lorevia.models.Libro;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LibroRepository extends JpaRepository<Libro, Long>{
    List<Libro> findByNombre(String nombre);
}
