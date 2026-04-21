package com.smartcampus.controller;

import com.smartcampus.dto.JwtResponse;
import com.smartcampus.dto.LoginRequest;
import com.smartcampus.dto.SignupRequest;
import com.smartcampus.entity.Role;
import com.smartcampus.entity.User;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.security.JwtUtils;
import com.smartcampus.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,
                          PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_STUDENT");

        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), role));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error: Email is already in use!");
            return ResponseEntity.badRequest().body(response);
        }

        Role userRole = (signUpRequest.getRole() != null && signUpRequest.getRole().equalsIgnoreCase("admin"))
                ? Role.ROLE_ADMIN : Role.ROLE_STUDENT;

        User user = new User(signUpRequest.getName(), signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()), userRole);

        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully!");
        return ResponseEntity.ok(response);
    }
}
