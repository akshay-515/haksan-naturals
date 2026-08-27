package com.haksannaturals.ecommerce.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public String test(Authentication authentication) {

        return "Authenticated user ID: " + authentication.getPrincipal()
                + ", role: " + authentication.getAuthorities();
    }
}