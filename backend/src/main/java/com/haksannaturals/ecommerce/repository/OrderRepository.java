package com.haksannaturals.ecommerce.repository;

import com.haksannaturals.ecommerce.entity.Order;
import com.haksannaturals.ecommerce.entity.OrderStatus;
import com.haksannaturals.ecommerce.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Order> findAllByOrderByCreatedAtDesc();

    long countByStatus(OrderStatus status);

    long countByPaymentStatus(PaymentStatus paymentStatus);

    @Query("""
        SELECT COALESCE(SUM(o.totalAmount), 0)
        FROM Order o
        WHERE o.paymentStatus = :paymentStatus
        """)
    BigDecimal sumRevenueByPaymentStatus(
            @Param("paymentStatus") PaymentStatus paymentStatus
    );
}
