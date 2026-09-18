package com.lorevia.lorevia.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LibroRequest(
        @NotBlank(message = "El nombre del libro es obligatorio")
        @Size(max = 255, message = "El nombre del libro no puede superar 255 caracteres")
        String nombre,

        @Size(max = 5000, message = "La sinopsis no puede superar 5000 caracteres")
        String sinopsis,

        List<Long> categoriasIds,

        List<Long> personajesIds) {}