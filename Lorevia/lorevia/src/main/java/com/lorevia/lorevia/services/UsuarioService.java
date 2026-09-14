package com.lorevia.lorevia.services;

import java.util.List;

import com.lorevia.lorevia.models.Usuario;

public interface UsuarioService {
    List<Usuario> findAll();
    Usuario findById(Long id);
    Usuario findByNombreUsuario(String nombreUsuario);
    Usuario save(Usuario usuario);
    Usuario update(Long id, Usuario usuario);
    void deleteById(Long id);
}
