package com.smartcampus.controller;

import com.smartcampus.entity.Event;
import com.smartcampus.repository.EventRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final EventRepository eventRepository;
    private final com.smartcampus.repository.RegistrationRepository registrationRepository;

    public AdminController(EventRepository eventRepository, com.smartcampus.repository.RegistrationRepository registrationRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
    }

    @PostMapping("/events")
    public ResponseEntity<Event> createEvent(@Valid @RequestBody Event event) {
        return ResponseEntity.ok(eventRepository.save(event));
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @Valid @RequestBody Event eventDetails) {
        return eventRepository.findById(id).map(event -> {
            event.setTitle(eventDetails.getTitle());
            event.setDescription(eventDetails.getDescription());
            event.setDate(eventDetails.getDate());
            event.setDepartment(eventDetails.getDepartment());
            event.setType(eventDetails.getType());
            event.setCapacity(eventDetails.getCapacity());
            return ResponseEntity.ok(eventRepository.save(event));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        return eventRepository.findById(id).map(event -> {
            eventRepository.delete(event);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event deleted successfully");
            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/events/{id}/registrations")
    public ResponseEntity<java.util.List<com.smartcampus.entity.Registration>> getEventRegistrations(@PathVariable Long id) {
        java.util.List<com.smartcampus.entity.Registration> registrations = registrationRepository.findByEventId(id);
        return ResponseEntity.ok(registrations);
    }
}
