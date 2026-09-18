package com.lorevia.lorevia.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PersonajeRequest(
        @NotBlank(message = "El nombre del personaje es obligatorio")
        @Size(max = 255, message = "El nombre del personaje no puede superar 255 caracteres")
        String nombre,

        @Size(max = 255, message = "El lugar de origen no puede superar 255 caracteres")
        String lugarOrigen,

        LocalDate fechaNacimiento,

        LocalDate fechaMuerte,

        List<Long> librosIds) {}