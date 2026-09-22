package com.haksannaturals.ecommerce.service;

import com.haksannaturals.ecommerce.dto.PaymentCreateRequest;
import com.haksannaturals.ecommerce.dto.PaymentVerifyRequest;
import com.haksannaturals.ecommerce.dto.RazorpayOrderResponse;
import com.haksannaturals.ecommerce.entity.Order;
import com.haksannaturals.ecommerce.entity.Payment;
import com.haksannaturals.ecommerce.entity.PaymentStatus;
import com.haksannaturals.ecommerce.repository.OrderRepository;
import com.haksannaturals.ecommerce.repository.PaymentRepository;
import com.haksannaturals.ecommerce.security.CurrentUserService;
import com.razorpay.RazorpayClient;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final CurrentUserService currentUserService;
    private final RazorpayClient razorpayClient;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Transactional
    public RazorpayOrderResponse createPayment(PaymentCreateRequest request) {

        // 1. Get logged-in user
        Long currentUserId = currentUserService.getCurrentUserId();

        // 2. Find order
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // 3. Verify order belongs to logged-in user
        if (!order.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("You are not allowed to pay for this order");
        }

        // 4. Check if payment already exists
        if (paymentRepository.findByOrderId(order.getId()).isPresent()) {
            throw new RuntimeException("Payment already exists for this order");
        }

        // 5. Convert amount from rupees to paise
        long amountInPaise = order.getTotalAmount()
                .multiply(java.math.BigDecimal.valueOf(100))
                .longValueExact();

        try {

            // 6. Create Razorpay order
            org.json.JSONObject options = new org.json.JSONObject();

            options.put("amount", amountInPaise);
            options.put("currency", "INR");
            options.put("receipt", "order_" + order.getId());

            com.razorpay.Order razorpayOrder =
                    razorpayClient.orders.create(options);

            // 7. Save local payment record
            Payment payment = Payment.builder()
                    .order(order)
                    .razorpayOrderId(razorpayOrder.get("id"))
                    .amount(order.getTotalAmount())
                    .status(PaymentStatus.PENDING)
                    .createdAt(java.time.LocalDateTime.now())
                    .updatedAt(java.time.LocalDateTime.now())
                    .build();

            Payment savedPayment = paymentRepository.save(payment);

            // 8. Return data needed by React
            return RazorpayOrderResponse.builder()
                    .paymentId(savedPayment.getId())
                    .orderId(order.getId())
                    .razorpayOrderId(razorpayOrder.get("id"))
                    .razorpayKeyId(razorpayKeyId)
                    .amount(order.getTotalAmount())
                    .currency("INR")
                    .status(razorpayOrder.get("status"))
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Failed to create Razorpay order", e);
        }
    }

    @Transactional
    public void verifyPayment(PaymentVerifyRequest request) {

        // 1. Find our local payment using Razorpay Order ID
        Payment payment = paymentRepository
                .findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // 2. Get the Razorpay Order ID
        String razorpayOrderId = request.getRazorpayOrderId();

        // 3. Build the signature payload
        String payload = razorpayOrderId + "|" + request.getRazorpayPaymentId();

        try {

            // 4. Verify Razorpay signature
            boolean isValid = com.razorpay.Utils.verifySignature(
                    payload,
                    request.getRazorpaySignature(),
                    razorpayKeySecret
            );

            if (!isValid) {
                throw new RuntimeException("Invalid payment signature");
            }

            // 5. Store Razorpay Payment ID
            payment.setPaymentId(request.getRazorpayPaymentId());

            // 6. Mark local payment as successful
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setUpdatedAt(java.time.LocalDateTime.now());

            paymentRepository.save(payment);

            // 7. Update Order payment status
            Order order = payment.getOrder();
            order.setPaymentStatus(PaymentStatus.SUCCESS);
            order.setUpdatedAt(java.time.LocalDateTime.now());

        } catch (Exception e) {
            throw new RuntimeException("Payment verification failed", e);
        }
    }
}
