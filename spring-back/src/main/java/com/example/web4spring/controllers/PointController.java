package com.example.web4spring.controllers;

import com.example.web4spring.model.Point;
import com.example.web4spring.service.JwtService;
import com.example.web4spring.service.PointService;
import com.example.web4spring.util.AreaChecker;
import com.example.web4spring.util.PointValidation;
import jakarta.persistence.Entity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;


import java.text.DecimalFormat;
import java.util.List;
import java.util.Map;
import java.util.Collections;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/shots")
public class PointController {
    @Autowired
    private PointService pointService;
    @Autowired
    private PointValidation validator;
    @Autowired
    private AreaChecker areaChecker;

    @PostMapping("/home")
    public ResponseEntity<Point> checkPoint(@RequestBody Map<String, String> coordinates) {
        System.out.println("ASDASD");
        DecimalFormat DF = new DecimalFormat("#.####");
        Point newPoint = new Point();
        newPoint.setX(Double.parseDouble(DF.format(Double.parseDouble(coordinates.get("x"))).replace(",", ".")));
        newPoint.setY(Double.parseDouble(DF.format(Double.parseDouble(coordinates.get("y"))).replace(",", ".")));
        newPoint.setR(Double.parseDouble(DF.format(Double.parseDouble(coordinates.get("r"))).replace(",", ".")));
        newPoint.setUserId(Long.parseLong(coordinates.get("uid")));
        if (!validator.validate(coordinates.get("action"), newPoint.getX(), newPoint.getY(), newPoint.getR())) {
            return ResponseEntity.noContent().build();
        }
        if (!areaChecker.check(newPoint.getX(), newPoint.getY(), newPoint.getR()))
            newPoint.setShot(0);
        else
            newPoint.setShot(1);
        pointService.savePoint(newPoint);
        return ResponseEntity.ok(newPoint);
    }

    @PostMapping("/points")
    public ResponseEntity<List<Point>> getPoints(@RequestBody Map<String, String> data) {
        if (data.get("action").equals("getAllForUser")) {
            List<Point> points = pointService.getPointsByUser(Long.valueOf(data.get("uid")));
            Collections.reverse(points);
            return ResponseEntity.ok(points);
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/points/paginated")
    public ResponseEntity<Page<Point>> getPointsPaginated(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Point> points = pointService.getPointsByUser(userId, page, size);
        return ResponseEntity.ok(points);
    }
}