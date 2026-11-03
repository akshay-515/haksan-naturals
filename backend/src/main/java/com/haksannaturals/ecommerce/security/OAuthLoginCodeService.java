
package com.haksannaturals.ecommerce.security;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class OAuthLoginCodeService {

    private final JdbcTemplate jdbcTemplate;

    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public String createCode(Long userId) {
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);

        String code = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);

        jdbcTemplate.update("""
                INSERT INTO oauth_login_codes
                    (code_hash, user_id, expires_at)
                VALUES
                    (?, ?, CURRENT_TIMESTAMP + INTERVAL '2 minutes')
                """,
                hashCode(code),
                userId
        );

        return code;
    }

    @Transactional
    public Long consumeCode(String code) {
        if (code == null || code.isBlank() || code.length() > 100) {
            return null;
        }

        try {
            return jdbcTemplate.queryForObject("""
                    DELETE FROM oauth_login_codes
                    WHERE code_hash = ?
                      AND expires_at > CURRENT_TIMESTAMP
                    RETURNING user_id
                    """,
                    Long.class,
                    hashCode(code)
            );
        } catch (EmptyResultDataAccessException exception) {
            return null;
        }
    }

    private String hashCode(String code) {
        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    code.getBytes(StandardCharsets.UTF_8)
            );

            return java.util.HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(
                    "SHA-256 is unavailable", exception
            );
        }
    }
}
