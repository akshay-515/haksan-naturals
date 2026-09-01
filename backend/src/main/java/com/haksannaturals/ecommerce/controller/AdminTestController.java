package com.haksannaturals.ecommerce.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminTestController {

    @GetMapping("/test")
    public String test(Authentication authentication) {

        return "Admin authenticated: "
                + authentication.getPrincipal()
                + ", role: "
                + authentication.getAuthorities();
    }
}