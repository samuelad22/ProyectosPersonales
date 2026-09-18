package com.lorevia.lorevia.models;


import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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
@Table(name= "categorias")
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String descripcion;
    @ManyToMany
    @JoinTable(
        name = "categoria_libro",
        joinColumns= @JoinColumn(name = "categoria_id"),
        inverseJoinColumns = @JoinColumn(name = "libro_id")
    )
    @JsonIgnore
    private Set<Libro> libros = new HashSet<>();
}
