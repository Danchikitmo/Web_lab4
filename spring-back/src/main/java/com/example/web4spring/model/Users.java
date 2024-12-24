package com.example.web4spring.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long uid;
    private String username;
    private String password;

    public void setUsername(String username) {
        this.username = username;
    }
    public String getUsername(){
        return this.username;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    public String getPassword(){
        return this.password;
    }
    public Long getUid(){
        return this.uid;
    }
}
