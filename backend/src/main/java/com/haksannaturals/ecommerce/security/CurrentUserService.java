package com.haksannaturals.ecommerce.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    public Long getCurrentUserId() {
        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if(authentication == null ||
            !authentication.isAuthenticated()) {

            throw new RuntimeException("User is not authenticated");
        }

        return (Long) authentication.getPrincipal();
    }
}
