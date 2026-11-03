package com.haksannaturals.ecommerce.service;

import com.haksannaturals.ecommerce.dto.AdminDashboardResponse;
import com.haksannaturals.ecommerce.entity.OrderStatus;
import com.haksannaturals.ecommerce.entity.PaymentStatus;
import com.haksannaturals.ecommerce.repository.OrderRepository;
import com.haksannaturals.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public AdminDashboardResponse getDashboardStats() {

        long totalOrders = orderRepository.count();

        long totalProducts = productRepository.count();

        long pendingOrders =
                orderRepository.countByStatus(OrderStatus.PENDING);

        BigDecimal totalRevenue =
                orderRepository.sumRevenueByPaymentStatus(
                        PaymentStatus.SUCCESS
                );

        return AdminDashboardResponse.builder()
                .totalOrders(totalOrders)
                .totalProducts(totalProducts)
                .pendingOrders(pendingOrders)
                .totalRevenue(totalRevenue)
                .build();
    }
}