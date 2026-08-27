package com.haksannaturals.ecommerce.controller;

import com.haksannaturals.ecommerce.dto.AuthResponse;
import com.haksannaturals.ecommerce.dto.OtpRequest;
import com.haksannaturals.ecommerce.dto.OtpVerifyRequest;
import com.haksannaturals.ecommerce.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/customer")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/otp/request")
    public ResponseEntity<Void> requestOtp(
            @Valid @RequestBody OtpRequest request
    ) {

        authService.requestOtp(request.getEmail());

        return ResponseEntity.ok().build();
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<AuthResponse> verifyOtp(
            @Valid @RequestBody OtpVerifyRequest request
    ) {

        return ResponseEntity.ok(
                authService.verifyOtp(request)
        );
    }
}