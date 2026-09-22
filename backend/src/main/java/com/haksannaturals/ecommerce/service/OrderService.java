package com.haksannaturals.ecommerce.service;

import com.haksannaturals.ecommerce.dto.OrderCreateRequest;
import com.haksannaturals.ecommerce.dto.OrderItemResponse;
import com.haksannaturals.ecommerce.dto.OrderResponse;
import com.haksannaturals.ecommerce.dto.OrderStatusUpdateRequest;
import com.haksannaturals.ecommerce.entity.*;
import com.haksannaturals.ecommerce.repository.AddressRepository;
import com.haksannaturals.ecommerce.repository.CartItemRepository;
import com.haksannaturals.ecommerce.repository.CartRepository;
import com.haksannaturals.ecommerce.repository.OrderItemRepository;
import com.haksannaturals.ecommerce.repository.OrderRepository;
import com.haksannaturals.ecommerce.repository.ProductRepository;
import com.haksannaturals.ecommerce.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;
    private final CurrentUserService currentUserService;

    @Transactional
    public OrderResponse createOrder(OrderCreateRequest request) {

        // 1. Get authenticated user
        Long userId = currentUserService.getCurrentUserId();

        // 2. Get user's cart
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Cart not found"));

        // 3. Get cart items
        List<CartItem> cartItems = cart.getItems();

        if (cartItems == null || cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // 4. Get and verify address
        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() ->
                        new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException(
                    "Address does not belong to the user"
            );
        }

        // 5. Create shipping address snapshot
        String shippingAddress = buildShippingAddress(address);

        // 6. Calculate total and validate stock
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();

            if (!product.isActive()) {
                throw new RuntimeException(
                        "Product is no longer available: "
                                + product.getName()
                );
            }

            if (product.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException(
                        "Insufficient stock for product: "
                                + product.getName()
                );
            }

            BigDecimal itemTotal = product.getPrice()
                    .multiply(
                            BigDecimal.valueOf(cartItem.getQuantity())
                    );

            totalAmount = totalAmount.add(itemTotal);
        }

        // 7. Create Order
        LocalDateTime now = LocalDateTime.now();

        User user = User.builder()
                .id(userId)
                .build();

        Order order = Order.builder()
                .user(user)
                .totalAmount(totalAmount)
                .status(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .shippingAddress(shippingAddress)
                .createdAt(now)
                .updatedAt(now)
                .build();

        Order savedOrder = orderRepository.save(order);

        // 8. Create OrderItems and reduce stock
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();

            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .price(product.getPrice())
                    .build();

            orderItems.add(orderItem);

            product.setStock(
                    product.getStock() - cartItem.getQuantity()
            );

            productRepository.save(product);
        }

        orderItemRepository.saveAll(orderItems);

        cart.getItems().clear();
        cart.setUpdatedAt(now);

        return buildOrderResponse(savedOrder, orderItems);
    }

    private String buildShippingAddress(Address address) {

        return address.getName() + ", "
                + address.getPhone() + ", "
                + address.getAddressLine() + ", "
                + address.getCity() + ", "
                + address.getState() + " - "
                + address.getPincode();
    }

    private OrderResponse buildOrderResponse(
            Order order,
            List<OrderItem> orderItems
    ) {

        List<OrderItemResponse> items = orderItems.stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .subtotal(
                                item.getPrice()
                                        .multiply(
                                                BigDecimal.valueOf(
                                                        item.getQuantity()
                                                )
                                        )
                        )
                        .build())
                .toList();

        return OrderResponse.builder()
                .orderId(order.getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .shippingAddress(order.getShippingAddress())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse>  getMyOrders() {

        Long userId = currentUserService.getCurrentUserId();

        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return orders.stream()
                .map(order -> {
                    List<OrderItem> orderItems =
                            orderItemRepository.findByOrderId(order.getId());

                    return buildOrderResponse(order, orderItems);
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId) {

        Long userId = currentUserService.getCurrentUserId();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order Not Found"));

        if(!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Order does not belong to the User");
        }

        List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getId());

        return buildOrderResponse(order, orderItems);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();

        return orders.stream()
                .map(order -> {
                    List<OrderItem> orderItems =
                            orderItemRepository.findByOrderId(order.getId());

                    return buildOrderResponse(order, orderItems);
                })
                .toList();
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order Not Found"));

        order.setStatus(request.getStatus());
        order.setUpdatedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems =
                orderItemRepository.findByOrderId(savedOrder.getId());

        return buildOrderResponse(savedOrder, orderItems);
    }
}