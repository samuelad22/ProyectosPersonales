package com.lorevia.lorevia.dto;

import com.lorevia.lorevia.Enums.Rol;

public record PerfilResponse(Long id, String nombreUsuario, String nombreReal,
                             String apellidos, String email, Rol rol) {}