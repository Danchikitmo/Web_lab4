package com.example.web4spring.service;

import com.example.web4spring.db.PointRepository;
import com.example.web4spring.model.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class PointService {
    @Autowired
    private PointRepository pointRepository;

    public List<Point> getPointsByUser(Long userId) {
        return pointRepository.findByUserId(userId);
    }

    public Page<Point> getPointsByUser(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return pointRepository.findByUserId(userId, pageable);
    }

    public List<Point> getAllPoints() {
        return pointRepository.findAll();
    }

    public Point savePoint(Point point) {
        return pointRepository.save(point);
    }

    public void deletePointsByUser(Long userId) {
        pointRepository.deleteByUserId(userId);
    }
}