package com.sltourism.backend.repository;

import com.sltourism.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    // User කෙනෙකුගේ බුකින්ග් ලිස්ට් එක ගන්න
    List<Booking> findByUserId(Long userId);
}
