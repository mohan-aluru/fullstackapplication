CREATE DATABASE IF NOT EXISTS smart_campus;
USE smart_campus;

-- Roles and users
INSERT INTO users (name, email, password, role) VALUES 
('Admin One', 'admin@smartcampus.edu', '$2a$10$r9C74.KxO/tD8qjB0O5e4uFv5g6s8V6xZ6k4x7O7d7s4n7r7h7v7', 'ROLE_ADMIN'), -- Assumes password 'admin'
('Admin Two', 'admin2@smartcampus.edu', '$2a$10$r9C74.KxO/tD8qjB0O5e4uFv5g6s8V6xZ6k4x7O7d7s4n7r7h7v7', 'ROLE_ADMIN'),
('Student One', 'student1@smartcampus.edu', '$2a$10$r9C74.KxO/tD8qjB0O5e4uFv5g6s8V6xZ6k4x7O7d7s4n7r7h7v7', 'ROLE_STUDENT'),
('Student Two', 'student2@smartcampus.edu', '$2a$10$r9C74.KxO/tD8qjB0O5e4uFv5g6s8V6xZ6k4x7O7d7s4n7r7h7v7', 'ROLE_STUDENT'),
('Student Three', 'student3@smartcampus.edu', '$2a$10$r9C74.KxO/tD8qjB0O5e4uFv5g6s8V6xZ6k4x7O7d7s4n7r7h7v7', 'ROLE_STUDENT'),
('Student Four', 'student4@smartcampus.edu', '$2a$10$r9C74.KxO/tD8qjB0O5e4uFv5g6s8V6xZ6k4x7O7d7s4n7r7h7v7', 'ROLE_STUDENT'),
('Student Five', 'student5@smartcampus.edu', '$2a$10$r9C74.KxO/tD8qjB0O5e4uFv5g6s8V6xZ6k4x7O7d7s4n7r7h7v7', 'ROLE_STUDENT');

-- We will allow Hibernate to auto-generate schemas, so we don't have CREATE TABLE statements here.
-- Instead, you can run this script AFTER letting Spring Boot run once with ddl-auto=update.

INSERT INTO events (title, description, date, department, type, capacity) VALUES 
('Full Stack Web Dev Workshop', 'Learn to build an end to end product with Spring Boot and React.', '2026-05-10 10:00:00', 'Computer Science', 'Workshop', 100),
('Annual Cultural Fest', 'A grand celebration of art, music, and performance.', '2026-06-20 18:00:00', 'Arts and Culture', 'Cultural', 500),
('Machine Learning Seminar', 'An introduction to Neural Networks and Deep Learning concepts.', '2026-06-25 14:00:00', 'Information Technology', 'Seminar', 150),
('Robotics Hackathon', '24-hour robotics challenge.', '2026-07-01 09:00:00', 'Electronics', 'Hackathon', 50),
('Career Counseling', 'Guidance for placements and higher education opportunities.', '2026-05-15 11:00:00', 'Placement Cell', 'Seminar', 200);
