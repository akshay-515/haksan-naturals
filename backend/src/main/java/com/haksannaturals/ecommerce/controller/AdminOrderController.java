package com.haksannaturals.ecommerce.controller;

import com.haksannaturals.ecommerce.dto.OrderResponse;
import com.haksannaturals.ecommerce.dto.OrderStatusUpdateRequest;
import com.haksannaturals.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {

        List<OrderResponse> orders = orderService.getAllOrders();

        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody OrderStatusUpdateRequest request
            ) {

        OrderResponse response = orderService.updateOrderStatus(orderId, request);

        return ResponseEntity.ok(response);
    }
}
