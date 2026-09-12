package com.lorevia.lorevia.models;

import java.time.LocalDate;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Embeddable
@AllArgsConstructor 
@NoArgsConstructor
@Getter
@Setter 
public class InformacionPersonaje {
    private String lugarOrigen;
    private LocalDate fechaNacimiento;
    private LocalDate fechaMuerte;  
}