package com.haksannaturals.ecommerce.security;

import com.haksannaturals.ecommerce.entity.User;
import com.haksannaturals.ecommerce.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler
        implements AuthenticationSuccessHandler {

    private final UserService userService;
    private final OAuthLoginCodeService oauthLoginCodeService;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OidcUser oidcUser = (OidcUser) authentication.getPrincipal();

        if (!Boolean.TRUE.equals(oidcUser.getEmailVerified())) {
            response.sendRedirect(
                    frontendUrl + "/auth/google/callback?error=email_not_verified"
            );
            return;
        }

        User user;

        try {
            user = userService.findOrCreateGoogleUser(
                    oidcUser.getEmail()
            );
        } catch (org.springframework.security.access.AccessDeniedException exception) {
            response.sendRedirect(
                    frontendUrl + "/auth/google/callback?error=account_not_allowed"
            );
            return;
        }

        String code = oauthLoginCodeService.createCode(user.getId());

        String redirectUrl = UriComponentsBuilder
                .fromUriString(frontendUrl)
                .path("/auth/google/callback")
                .queryParam("code", code)
                .build()
                .encode()
                .toUriString();

        response.sendRedirect(redirectUrl);
    }
}
