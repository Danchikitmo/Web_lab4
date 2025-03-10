package com.example.web4spring.db;

import com.example.web4spring.model.Point;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PointRepository extends JpaRepository<Point, Long> {
    List<Point> findByUserId(Long userId);
    Page<Point> findByUserId(Long userId, Pageable pageable);
    void deleteByUserId(Long userId);
}
