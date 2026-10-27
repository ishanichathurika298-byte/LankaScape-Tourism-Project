package com.sltourism.backend.controller;

import com.sltourism.backend.model.Destination;
import com.sltourism.backend.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
@CrossOrigin(origins = "*") // Frontend එකෙන් එන requests වලට ඉඩ දෙන්න
public class DestinationController {

    @Autowired
    private DestinationRepository destinationRepository;

    // Database එකේ තියෙන ඔක්කොම සංචාරක ස්ථාන ටික A to Z අකාරාදී පිළිවෙළට (Alphabetical order) ගන්න API එක
    @GetMapping
    public List<Destination> getAllDestinations() {
        return destinationRepository.findAllByOrderByNameAsc();
    }

    // තනි ස්ථානයක විස්තර ID එකෙන් ගන්න API එක (Details view)
    @GetMapping("/{id}")
    public ResponseEntity<Destination> getDestinationById(@PathVariable Long id) {
        return destinationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
