package com.example.web4spring.util;

import org.springframework.stereotype.Component;

@Component
public class AreaChecker {
    public boolean check(double x, double y, double r) {
        if (!isValidInput(x, y, r)) {
            return false;
        }
        return checkRectangle(x, y, r) || checkTriangle(x, y, r) || checkCircle(x, y, r);
    }

    private boolean isValidInput(double x, double y, double r) {
        return r > 0 && Math.abs(x) <= r && Math.abs(y) <= r;
    }

    private boolean checkRectangle(double x, double y, double r) {
        return x >= 0 && y >= 0 && x <= r && y <= r / 2;
    }

    private boolean checkTriangle(double x, double y, double r) {
        return x <= 0 && y >= 0 && x >= -r / 2 && y <= r / 2 && y <= x + r / 2;
    }

    private boolean checkCircle(double x, double y, double r) {
        return x >= 0 && y <= 0 && x <= r / 2 && y >= -r / 2 && (x * x + y * y <= (r / 2) * (r / 2));
    }
}