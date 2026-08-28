package com.haksannaturals.ecommerce.service;

import com.haksannaturals.ecommerce.entity.Role;
import com.haksannaturals.ecommerce.entity.User;
import com.haksannaturals.ecommerce.repository.UserRepository;
import com.haksannaturals.ecommerce.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public String login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid credentials")
                );

        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!passwordEncoder.matches(
                password,
                user.getPasswordHash()
        )) {
            throw new RuntimeException("Invalid credentials");
        }

        return jwtService.generateToken(
                user.getId(),
                user.getRole()
        );
    }
}