package com.lorevia.lorevia.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lorevia.lorevia.models.Usuario;


public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
    boolean existsByNombreUsuario(String nombreUsuario);
    boolean existsByEmail(String email);
    Optional<Usuario> findByEmail(String email);
}
