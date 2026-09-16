package com.lorevia.lorevia.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lorevia.lorevia.models.Usuario;


public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
    boolean existsByNombre(String nombre);
    boolean existsByEmail(String nombre);
    Optional<Usuario> findByEmail(String nombre);
}
