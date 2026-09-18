package com.lorevia.lorevia.services;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.lorevia.lorevia.Enums.Rol;
import com.lorevia.lorevia.Repositories.UsuarioRepository;
import com.lorevia.lorevia.dto.AuthResponse;
import com.lorevia.lorevia.dto.PerfilResponse;
import com.lorevia.lorevia.dto.RegistroRequest;
import com.lorevia.lorevia.models.Usuario;

@Service
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationProvider authenticationProvider;

    public AuthServiceImpl(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder,
                           JwtService jwtService, AuthenticationProvider authenticationProvider) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationProvider = authenticationProvider;
    }

    @Override
    public AuthResponse registrarUsuario(RegistroRequest registroRequest) {
        if (usuarioRepository.existsByEmail(registroRequest.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El email ya está registrado");
        }
        if (usuarioRepository.existsByNombreUsuario(registroRequest.nombreUsuario())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El nombre de usuario ya está registrado");
        }
        Usuario usuario = new Usuario();
        usuario.setEmail(registroRequest.email());
        usuario.setNombreUsuario(registroRequest.nombreUsuario());
        usuario.setNombreReal(registroRequest.nombreReal());
        usuario.setApellidos(registroRequest.apellidos());
        usuario.setPassword(passwordEncoder.encode(registroRequest.password()));
        usuario.setRol(Rol.USER);
        Usuario guardado = usuarioRepository.save(usuario);
        return construirRespuesta(guardado, jwtService.generarToken(guardado.getEmail()));
    }

    @Override
    public AuthResponse autenticarUsuario(String email, String password) {
        try {
            authenticationProvider.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        } catch (AuthenticationException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
        }
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas"));
        return construirRespuesta(usuario, jwtService.generarToken(usuario.getEmail()));
    }

    @Override
    public PerfilResponse obtenerPerfil(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No autenticado"));
        return new PerfilResponse(usuario.getId(), usuario.getNombreUsuario(), usuario.getNombreReal(),
                usuario.getApellidos(), usuario.getEmail(), usuario.getRol());
    }

    private AuthResponse construirRespuesta(Usuario usuario, String token) {
        return new AuthResponse(token, usuario.getId(), usuario.getNombreUsuario(),
                usuario.getNombreReal(), usuario.getApellidos(), usuario.getEmail(), usuario.getRol());
    }
}