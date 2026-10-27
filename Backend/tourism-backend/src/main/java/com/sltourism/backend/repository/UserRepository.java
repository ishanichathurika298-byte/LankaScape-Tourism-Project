package com.sltourism.backend.repository;

import com.sltourism.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // ඊමේල් එකෙන් User කෙනෙක් ඉන්නවද කියලා හොයන්න
    Optional<User> findByEmail(String email);
}
