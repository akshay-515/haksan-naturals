package com.haksannaturals.ecommerce.controller;

import com.haksannaturals.ecommerce.dto.AuthResponse;
import com.haksannaturals.ecommerce.dto.GoogleCodeExchangeRequest;
import com.haksannaturals.ecommerce.dto.OtpRequest;
import com.haksannaturals.ecommerce.dto.OtpVerifyRequest;
import com.haksannaturals.ecommerce.entity.Role;
import com.haksannaturals.ecommerce.entity.User;
import com.haksannaturals.ecommerce.security.JwtService;
import com.haksannaturals.ecommerce.security.OAuthLoginCodeService;
import com.haksannaturals.ecommerce.service.AuthService;
import com.haksannaturals.ecommerce.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/customer")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OAuthLoginCodeService oauthLoginCodeService;
    private final UserService userService;
    private final JwtService jwtService;

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

    @PostMapping("/google/exchange")
    public ResponseEntity<AuthResponse> exchangeGoogleCode(
            @Valid @RequestBody GoogleCodeExchangeRequest request
    ) {
        Long userId = oauthLoginCodeService.consumeCode(request.getCode());

        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        User user = userService.getUserById(userId);

        if (user.getRole() != Role.CUSTOMER) {
            return ResponseEntity.status(403).build();
        }

        String token = jwtService.generateToken(
                user.getId(),
                user.getRole()
        );

        return ResponseEntity.ok(new AuthResponse(token));
    }
}