package com.haksannaturals.ecommerce.controller;

import com.haksannaturals.ecommerce.dto.PaymentCreateRequest;
import com.haksannaturals.ecommerce.dto.PaymentVerifyRequest;
import com.haksannaturals.ecommerce.dto.RazorpayOrderResponse;
import com.haksannaturals.ecommerce.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<RazorpayOrderResponse> createPayment(
            @RequestBody PaymentCreateRequest request) {

        return ResponseEntity.ok(
                paymentService.createPayment(request)
        );
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(
            @Valid @RequestBody PaymentVerifyRequest request) {

        paymentService.verifyPayment(request);

        return ResponseEntity.ok("Payment verified successfully");
    }

}