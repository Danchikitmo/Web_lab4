package com.example.web4spring.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.Properties;

@Service
public class JwtService {
    private static final Properties properties = new Properties();
    private static final ClassLoader loader = Thread.currentThread().getContextClassLoader();
    private static final InputStream stream = loader.getResourceAsStream("application.properties");
    private static final String SECRET_KEY;
    static {
        try {
            properties.load(stream);
            SECRET_KEY = properties.getProperty("secretKey");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
    private static final long EXPIRATION_TIME = 86400000; // 1 день (мс)

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY.getBytes())
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY.getBytes())
                .build()
                .parseSignedClaims(token)
                .getBody()
                .getSubject();
    }

    public boolean isTokenValid(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY.getBytes())
                .build()
                .parseSignedClaims(token)
                .getBody()
                .getExpiration()
                .before(new Date());
    }
}
