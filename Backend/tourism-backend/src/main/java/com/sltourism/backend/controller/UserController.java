package com.sltourism.backend.controller;

import com.sltourism.backend.model.User;
import com.sltourism.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Frontend එකට ලින්ක් වෙන්න අවසර දෙනවා
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // අලුත් User කෙනෙක් රෙජිස්ටර් කරන API එක
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User newUser) {
        // මේ ඊමේල් එකෙන් කලින් කෙනෙක් රෙජිස්ටර් වෙලාද බලනවා
        if (userRepository.findByEmail(newUser.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already registered!");
        }
        
        // අලුත් කෙනාව Database එකට සේව් කරනවා
        userRepository.save(newUser);
        return ResponseEntity.ok("User registered successfully!");
    }

    // Login වෙන API එක
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginDetails) {
        Optional<User> user = userRepository.findByEmail(loginDetails.getEmail());
        
        // ඊමේල් එක සහ පාස්වර්ඩ් එක හරිද කියලා බලනවා
        if (user.isPresent() && user.get().getPassword().equals(loginDetails.getPassword())) {
            // Frontend එකට User ගේ විස්තර (ID එකත් එක්ක) යවනවා
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.badRequest().body("Invalid email or password!");
        }
    }
}
