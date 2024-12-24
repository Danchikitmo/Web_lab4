package com.example.web4spring.util;

import org.springframework.stereotype.Component;

@Component
public class AreaChecker {
    public boolean check(double x, double y, double r){
        return checkRect(x, y, r) || checkTriangle(x, y, r) || checkCircle(x, y, r);
    }

    private boolean checkRect(double X, double Y, double R){
        return (X <= 0 && Y >= 0) && (X >= -R && Y <= R/2);
    }
    private boolean checkTriangle(double X, double Y, double R){
        return (X >= 0 && Y >= 0) && (X <= R && Y <= R/2) && (X + 2 * Y <= R);
    }
    private boolean checkCircle(double X, double Y, double R){
        return (X >= -R/2 && Y >= -R/2) && (X <= 0 && Y <= 0) && (X * X + Y * Y <= R * R);
    }
}
