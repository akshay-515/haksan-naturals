package com.haksannaturals.ecommerce.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class RazorpayOrderResponse {

    private Long paymentId;

    private Long orderId;

    private String razorpayOrderId;

    private String razorpayKeyId;

    private BigDecimal amount;

    private String currency;

    private String status;
}