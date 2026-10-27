package com.sltourism.backend.repository;

import com.sltourism.backend.model.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {
    List<Destination> findAllByOrderByNameAsc();
}
