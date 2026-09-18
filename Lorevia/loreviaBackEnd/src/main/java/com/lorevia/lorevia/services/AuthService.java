package com.lorevia.lorevia.services;

import com.lorevia.lorevia.dto.AuthResponse;
import com.lorevia.lorevia.dto.PerfilResponse;
import com.lorevia.lorevia.dto.RegistroRequest;

public interface AuthService {
    AuthResponse registrarUsuario(RegistroRequest registroRequest);
    AuthResponse autenticarUsuario(String email, String password);
    PerfilResponse obtenerPerfil(String email);
}