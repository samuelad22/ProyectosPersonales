package com.lorevia.lorevia.Repositories;

import com.lorevia.lorevia.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
    boolean existsByNombreUsuario(String nombre);
}
