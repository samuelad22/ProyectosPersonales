package com.lorevia.lorevia.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.lorevia.lorevia.Enums.Rol;
import com.lorevia.lorevia.Repositories.UsuarioRepository;
import com.lorevia.lorevia.models.Usuario;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    @Override
    public Usuario findById(Long id) {
        return usuarioRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
    }

    @Override
    public Usuario findByNombre(String nombreUsuario) {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios.stream()
                .filter(u -> u.getNombreUsuario().equals(nombreUsuario))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
    }


    @Override
    public Usuario update(Long id, Usuario usuario) {
        Usuario existing = usuarioRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
        if (usuario.getNombreUsuario() != null) {
            existing.setNombreUsuario(usuario.getNombreUsuario());
        }
        if (usuario.getNombreReal() != null) {
            existing.setNombreReal(usuario.getNombreReal());
        }
        if (usuario.getApellidos() != null) {
            existing.setApellidos(usuario.getApellidos());
        }
        if (usuario.getEmail() != null && !usuario.getEmail().isBlank()) {
            existing.setEmail(usuario.getEmail());
        }
        if (usuario.getPassword() != null && !usuario.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(usuario.getPassword()));
        }
        return usuarioRepository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    public boolean existsByEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
    @Override
    public Usuario save(Usuario usuario) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        if (usuario.getRol() == null) {
            usuario.setRol(Rol.USER);
        }
        return usuarioRepository.save(usuario);
    }
}
