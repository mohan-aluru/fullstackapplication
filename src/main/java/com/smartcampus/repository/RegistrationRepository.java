package com.smartcampus.repository;

import com.smartcampus.entity.Registration;
import com.smartcampus.entity.RegStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByUserId(Long userId);
    List<Registration> findByUserIdAndStatus(Long userId, RegStatus status);
    List<Registration> findByEventId(Long eventId);
    boolean existsByUserIdAndEventIdAndStatus(Long userId, Long eventId, RegStatus status);
    long countByEventIdAndStatus(Long eventId, RegStatus status);
    java.util.Optional<Registration> findByUserIdAndEventId(Long userId, Long eventId);
}
