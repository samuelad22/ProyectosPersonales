package com.lorevia.lorevia.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.lorevia.lorevia.Enums.Rol;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombreUsuario;
    private String nombreReal;
    private String apellidos;
    @Column(nullable = false, unique = true)
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    @Enumerated(EnumType.STRING)
    private Rol rol;

    // Getter manual (Lombok no lo genera al existir): usuarios preexistentes con rol NULL reciben USER por defecto
    public Rol getRol() {
        return rol != null ? rol : Rol.USER;
    }
}