package com.haksannaturals.ecommerce.service;

import com.haksannaturals.ecommerce.entity.AuthProvider;
import com.haksannaturals.ecommerce.entity.Role;
import com.haksannaturals.ecommerce.entity.User;
import com.haksannaturals.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User findOrCreateCustomer(String email) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User user = User.builder()
                            .email(email)
                            .role(Role.CUSTOMER)
                            .name(email.substring(0,5))
                            .authProvider(AuthProvider.EMAIL_OTP)
                            .emailVerified(true)
                            .phoneVerified(false)
                            .build();
                    return userRepository.save(user);
                });
    }

    public User findOrCreateGoogleUser(String email) {

        return userRepository.findByEmail(email)
                .orElseGet(() -> {

                    User user = User.builder()
                            .email(email)
                            .role(Role.CUSTOMER)
                            .name(email.substring(0,5))
                            .authProvider(AuthProvider.GOOGLE)
                            .emailVerified(true)
                            .phoneVerified(false)
                            .build();

                    return userRepository.save(user);
                });
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


}
