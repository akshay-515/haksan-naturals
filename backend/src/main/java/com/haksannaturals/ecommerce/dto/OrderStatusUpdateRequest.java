package com.haksannaturals.ecommerce.dto;

import com.haksannaturals.ecommerce.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderStatusUpdateRequest {

    @NotNull
    private OrderStatus status;
}