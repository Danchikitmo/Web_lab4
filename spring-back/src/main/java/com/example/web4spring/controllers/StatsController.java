/*package com.example.web4spring.controllers;

import com.example.web4spring.model.Point;
import com.example.web4spring.model.Stats;
import com.example.web4spring.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stats")
public class StatsController {
    @Autowired
    private StatsService statsService;
    @PostMapping("/get")
    public ResponseEntity<List<Stats>> getStats(@RequestBody Map<String, String> data) {
        return switch (data.get("action")) {
            case "getAll" -> ResponseEntity.ok(statsService.getAllStats().stream().sorted(Comparator.comparing(Stats::getScore).reversed())
                    .collect(Collectors.toList()));
            case "getAllForUser" -> ResponseEntity.ok(Collections.singletonList(statsService.getStatsByUser(Long.valueOf(data.get("uid")))));
            default -> ResponseEntity.noContent().build();
        };
    }
}
*/