package com.lorevia.lorevia.dto;

import com.lorevia.lorevia.Enums.Rol;

public record AuthResponse(String token, Long id, String nombreUsuario, String nombreReal,
                           String apellidos, String email, Rol rol) {}