package com.example.web4spring.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Point {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int shot;
    private double X;
    private double Y;
    private double R;
    private Long userId;

    public double getX(){
        return this.X;
    }
    public double getY(){
        return this.Y;
    }
    public double getR(){
        return this.R;
    }
    public int getShot(){
        return this.shot;
    }
    public Long getUserId(){
        return this.userId;
    }

    public void setX(double x){
        this.X = x;
    }
    public void setY(double y){
        this.Y = y;
    }
    public void setR(double r){
        this.R = r;
    }
    public void setUserId(Long userId){
        this.userId = userId;
    }

    public void setShot(int i) {
        this.shot = i;
    }
}