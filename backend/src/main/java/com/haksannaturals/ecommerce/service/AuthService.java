package com.haksannaturals.ecommerce.service;

import com.haksannaturals.ecommerce.dto.AuthResponse;
import com.haksannaturals.ecommerce.dto.OtpVerifyRequest;
import com.haksannaturals.ecommerce.security.JwtService;
import com.haksannaturals.ecommerce.security.otp.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final OtpService otpService;
    private final UserService userService;
    private final JwtService jwtService;

    public void requestOtp(String email) {
        otpService.generateAndStoreOtp(email);
    }

    public AuthResponse verifyOtp(OtpVerifyRequest request) {

        boolean valid = otpService.verifyOtp(
                request.getEmail(),
                request.getOtp()
        );

        if (!valid) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        var user = userService.findOrCreateCustomer(
                request.getEmail()
        );

        String token = jwtService.generateToken(
                user.getId(),
                user.getRole()
        );

        return new AuthResponse(token);
    }
}