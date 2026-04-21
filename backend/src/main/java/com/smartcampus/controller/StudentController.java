package com.smartcampus.controller;

import com.smartcampus.entity.Event;
import com.smartcampus.entity.Registration;
import com.smartcampus.entity.RegStatus;
import com.smartcampus.entity.User;
import com.smartcampus.repository.EventRepository;
import com.smartcampus.repository.RegistrationRepository;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.security.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public StudentController(RegistrationRepository registrationRepository, EventRepository eventRepository, UserRepository userRepository) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetailsImpl) {
            String email = ((UserDetailsImpl) principal).getUsername();
            return userRepository.findByEmail(email).orElse(null);
        }
        return null;
    }

    @PostMapping("/register/{eventId}")
    public ResponseEntity<?> registerForEvent(@PathVariable Long eventId) {
        User user = getCurrentUser();
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Event event = eventOpt.get();
        if (registrationRepository.existsByUserIdAndEventIdAndStatus(user.getId(), event.getId(), RegStatus.REGISTERED)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Already registered for this event"));
        }

        long count = registrationRepository.countByEventIdAndStatus(event.getId(), RegStatus.REGISTERED);
        if (count >= event.getCapacity()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Event is fully booked"));
        }

        Registration reg = registrationRepository.findByUserIdAndEventId(user.getId(), event.getId()).orElse(new Registration());
        reg.setEvent(event);
        reg.setUser(user);
        reg.setStatus(RegStatus.REGISTERED);
        registrationRepository.save(reg);

        return ResponseEntity.ok(Map.of("message", "Successfully registered"));
    }

    @DeleteMapping("/unregister/{eventId}")
    public ResponseEntity<?> unregisterForEvent(@PathVariable Long eventId) {
        User user = getCurrentUser();
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        Optional<Registration> regOpt = registrationRepository.findByUserIdAndEventId(user.getId(), eventId);
        if (regOpt.isPresent() && regOpt.get().getStatus() == RegStatus.REGISTERED) {
            Registration reg = regOpt.get();
            reg.setStatus(RegStatus.CANCELLED);
            registrationRepository.save(reg);
            return ResponseEntity.ok(Map.of("message", "Successfully unregistered"));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Not registered for this event"));
    }

    @GetMapping("/my-events")
    public ResponseEntity<List<Registration>> getMyEvents() {
        User user = getCurrentUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        List<Registration> registrations = registrationRepository.findByUserIdAndStatus(user.getId(), RegStatus.REGISTERED);
        registrations.forEach(r -> {
            long count = registrationRepository.countByEventIdAndStatus(r.getEvent().getId(), RegStatus.REGISTERED);
            r.getEvent().setRegisteredCount((int) count);
        });
        return ResponseEntity.ok(registrations);
    }
}
