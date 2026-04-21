package com.smartcampus.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "events")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @Lob
    private String description;

    @NotNull
    private LocalDateTime date;

    @NotBlank
    private String department;

    @NotBlank
    private String type; // e.g., Workshop, Seminar, Cultural

    @NotNull
    private Integer capacity;

    public Event() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    @Transient
    private int registeredCount;

    public int getRegisteredCount() { return registeredCount; }
    public void setRegisteredCount(int registeredCount) { this.registeredCount = registeredCount; }
}
