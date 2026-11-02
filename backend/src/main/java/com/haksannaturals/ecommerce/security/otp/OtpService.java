package com.haksannaturals.ecommerce.security.otp;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class OtpService {

    private static final int OTP_EXPIRATION_MINUTES = 5;

    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, OtpData> otpStore =
            new ConcurrentHashMap<>();

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:}")
    private String fromAddress;

    public void generateAndStoreOtp(String email) {
        if (fromAddress == null || fromAddress.isBlank()) {
            throw new IllegalStateException(
                    "Email sender is not configured"
            );
        }

        String otp = String.format(
                "%06d",
                secureRandom.nextInt(1_000_000)
        );

        OtpData otpData = new OtpData(
                otp,
                LocalDateTime.now().plusMinutes(OTP_EXPIRATION_MINUTES)
        );

        otpStore.put(email, otpData);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(email);
            message.setSubject("Your Haksan Naturals login code");
            message.setText(
                    "Hello,\n\n"
                            + "Your Haksan Naturals verification code is: "
                            + otp
                            + "\n\nThis code expires in 5 minutes and can "
                            + "only be used once.\n\n"
                            + "If you did not request this code, you can "
                            + "ignore this email."
            );

            mailSender.send(message);

        } catch (RuntimeException exception) {
            otpStore.remove(email, otpData);

            throw new IllegalStateException(
                    "Unable to send verification email",
                    exception
            );
        }
    }

    public boolean verifyOtp(String email, String otp) {
        OtpData otpData = otpStore.get(email);

        if (otpData == null) {
            return false;
        }

        if (!LocalDateTime.now().isBefore(otpData.getExpiresAt())) {
            otpStore.remove(email, otpData);
            return false;
        }

        if (!otpData.getOtp().equals(otp)) {
            return false;
        }

        otpStore.remove(email, otpData);
        return true;
    }
}
