package com.lorevia.lorevia.models;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
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
@Table(name= "personajes")
public class Personaje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    @Embedded
    private InformacionPersonaje informacionPersonaje;
    @OneToMany(mappedBy = "personajeOrigen")
    private Set<Parentesco> parentescosOrigen = new HashSet<>();
    @OneToMany(mappedBy = "personajeDestino")
    private Set<Parentesco> parentescosDestino = new HashSet<>();
    @ManyToMany
    @JoinTable(
        name = "personaje_libro",
        joinColumns = @JoinColumn(name = "personaje_id"),
        inverseJoinColumns = @JoinColumn(name = "libro_id")
    )
    private Set<Libro> libros = new HashSet<>();
}
