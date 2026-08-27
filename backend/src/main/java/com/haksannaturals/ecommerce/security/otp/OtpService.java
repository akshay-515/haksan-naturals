package com.haksannaturals.ecommerce.security.otp;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class OtpService {

    private static final int OTP_EXPIRATION_MINUTES = 5;

    private final SecureRandom secureRandom = new SecureRandom();

    private final Map<String, OtpData> otpStore = new ConcurrentHashMap<>();

    public void generateAndStoreOtp(String email) {

        String otp = String.format(
                "%06d",
                secureRandom.nextInt(1_000_000)
        );

        LocalDateTime expiresAt =
                LocalDateTime.now().plusMinutes(OTP_EXPIRATION_MINUTES);

        otpStore.put(
                email,
                new OtpData(otp, expiresAt)
        );

        log.info("Development OTP for {}: {}", email, otp);
    }

    public boolean verifyOtp(String email, String otp) {

        OtpData otpData = otpStore.get(email);

        if (otpData == null) {
            return false;
        }

        if (LocalDateTime.now().isAfter(otpData.getExpiresAt())) {
            otpStore.remove(email);
            return false;
        }

        if (!otpData.getOtp().equals(otp)) {
            return false;
        }

        otpStore.remove(email);

        return true;
    }
}