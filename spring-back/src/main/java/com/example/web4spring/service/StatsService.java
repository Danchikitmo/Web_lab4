/*package com.example.web4spring.service;

import com.example.web4spring.db.StatsRepository;
import com.example.web4spring.model.Stats;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StatsService {
    @Autowired
    private StatsRepository statsRepository;

    public Stats getStatsByUser(Long userId) {
        return statsRepository.findByUserId(userId).get(0);
    }
    public Stats getStatsById(Long id) {
        Optional<Stats> statsOptional = statsRepository.findById(id);
        return statsOptional.orElse(null);
    }
    public List<Stats> getAllStats(){
        return statsRepository.findAll();
    }

    public Stats createStats(Stats stats) {
        return statsRepository.save(stats);
    }

    public Stats updateStats(boolean alive, Long id) {
        Stats currStats = getStatsByUser(id);
        Long score;
        if (alive)
            currStats.setAlive(currStats.getAlive()+1);
        else
            currStats.setDied(currStats.getDied()+1);
        if (currStats.getAlive() - currStats.getDied() < 0)
            score = 0L;
        else
            score = currStats.getAlive() - currStats.getDied();
        currStats.setScore(score);
        return statsRepository.save(currStats);
    }

}
*/