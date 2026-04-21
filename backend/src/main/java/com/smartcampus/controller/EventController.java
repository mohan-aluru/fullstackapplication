package com.smartcampus.controller;

import com.smartcampus.entity.Event;
import com.smartcampus.repository.EventRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventRepository eventRepository;
    private final com.smartcampus.repository.RegistrationRepository registrationRepository;

    public EventController(EventRepository eventRepository, com.smartcampus.repository.RegistrationRepository registrationRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        events.forEach(event -> {
            long count = registrationRepository.countByEventIdAndStatus(event.getId(), com.smartcampus.entity.RegStatus.REGISTERED);
            event.setRegisteredCount((int) count);
        });
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return eventRepository.findById(id).map(event -> {
            long count = registrationRepository.countByEventIdAndStatus(event.getId(), com.smartcampus.entity.RegStatus.REGISTERED);
            event.setRegisteredCount((int) count);
            return ResponseEntity.ok(event);
        }).orElse(ResponseEntity.notFound().build());
    }
}
