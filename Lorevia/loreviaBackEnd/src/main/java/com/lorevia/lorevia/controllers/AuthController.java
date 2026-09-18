package com.lorevia.lorevia.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.lorevia.lorevia.dto.AuthResponse;
import com.lorevia.lorevia.dto.LoginRequest;
import com.lorevia.lorevia.dto.PerfilResponse;
import com.lorevia.lorevia.dto.RegistroRequest;
import com.lorevia.lorevia.services.AuthService;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/registro")
    public ResponseEntity<AuthResponse> registrar(@Valid @RequestBody RegistroRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registrarUsuario(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> iniciarSesion(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.autenticarUsuario(request.email(), request.password()));
    }

    @GetMapping("/perfil")
    public ResponseEntity<PerfilResponse> obtenerPerfil() {
        Authentication autenticacion = SecurityContextHolder.getContext().getAuthentication();
        String email = autenticacion.getName();
        return ResponseEntity.ok(authService.obtenerPerfil(email));
    }
}