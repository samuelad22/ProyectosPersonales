package com.lorevia.lorevia.services;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final String claveSecreta;
    private final Long duracionMs;

    public JwtService(@Value("${jwt.secret}") String claveSecreta,
                      @Value("${jwt.duracionMs}") Long duracionMs) {
        this.claveSecreta = claveSecreta;
        this.duracionMs = duracionMs;
    }

    private SecretKey obtenerClaveSecreta() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(claveSecreta));
    }

    public String generarToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + duracionMs))
                .signWith(obtenerClaveSecreta())
                .compact();
    }

    private Claims extraerClaims(String token) {
        return Jwts.parser()
                .verifyWith(obtenerClaveSecreta())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private boolean estaExpirado(String token) {
        return extraerClaims(token).getExpiration().before(new Date());
    }

    public String extraerEmail(String token) {
        if (token == null || token.isBlank()) {
            return null;
        }
        try {
            return extraerClaims(token).getSubject();
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    public boolean esTokenValido(String token, UserDetails detallesUsuario) {
        if (token == null || token.isBlank()) {
            return false;
        }
        try {
            return detallesUsuario.getUsername().equals(extraerEmail(token)) && !estaExpirado(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}