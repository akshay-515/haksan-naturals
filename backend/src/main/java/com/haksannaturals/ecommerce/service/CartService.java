package com.haksannaturals.ecommerce.service;

import com.haksannaturals.ecommerce.dto.CartItemRequest;
import com.haksannaturals.ecommerce.dto.CartItemResponse;
import com.haksannaturals.ecommerce.dto.CartResponse;
import com.haksannaturals.ecommerce.entity.Cart;
import com.haksannaturals.ecommerce.entity.CartItem;
import com.haksannaturals.ecommerce.entity.Product;
import com.haksannaturals.ecommerce.entity.User;
import com.haksannaturals.ecommerce.repository.CartItemRepository;
import com.haksannaturals.ecommerce.repository.CartRepository;
import com.haksannaturals.ecommerce.repository.ProductRepository;
import com.haksannaturals.ecommerce.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CurrentUserService currentUserService;

    public Cart getOrCreateCart() {

        Long userId = currentUserService.getCurrentUserId();

        return cartRepository.findByUserId(userId)
                .orElseGet(() -> createCart(userId));
    }

    public CartResponse getCartResponse() {

        Cart cart = getOrCreateCart();

        List<CartItemResponse> items = cart.getItems()
                .stream()
                .map(item -> {

                    Product product = item.getProduct();

                    BigDecimal subtotal = product.getPrice()
                            .multiply(
                                    BigDecimal.valueOf(item.getQuantity())
                            );

                    return CartItemResponse.builder()
                            .itemId(item.getId())
                            .productId(product.getId())
                            .productName(product.getName())
                            .price(product.getPrice())
                            .imageUrl(product.getImageUrl())
                            .quantity(item.getQuantity())
                            .subtotal(subtotal)
                            .build();
                })
                .toList();

        BigDecimal totalAmount = items.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .totalAmount(totalAmount)
                .build();
    }

    private Cart createCart(Long userId) {

        User user = User.builder()
                .id(userId)
                .build();

        LocalDateTime now = LocalDateTime.now();

        Cart cart = Cart.builder()
                .user(user)
                .createdAt(now)
                .updatedAt(now)
                .build();

        return cartRepository.save(cart);
    }

    @Transactional
    public CartItem addToCart(CartItemRequest request) {

        Cart cart = getOrCreateCart();

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.isActive()) {
            throw new RuntimeException("Product is not available");
        }

        CartItem cartItem = cartItemRepository
                .findByCartIdAndProductId(cart.getId(), product.getId())
                .orElse(null);

        if (cartItem != null) {

            cartItem.setQuantity(
                    cartItem.getQuantity() + request.getQuantity()
            );

        } else {

            cartItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
        }

        cart.setUpdatedAt(LocalDateTime.now());

        cartRepository.save(cart);

        return cartItemRepository.save(cartItem);
    }

    @Transactional
    public CartItem updateQuantity(Long itemId, Integer quantity) {

        if (quantity < 1) {
            throw new RuntimeException("Quantity must be at least 1");
        }

        Long userId = currentUserService.getCurrentUserId();

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to the user");
        }

        cartItem.setQuantity(quantity);

        cart.setUpdatedAt(LocalDateTime.now());

        cartRepository.save(cart);

        return cartItemRepository.save(cartItem);
    }

    @Transactional
    public void removeItem(Long itemId) {

        Long userId = currentUserService.getCurrentUserId();

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to the user");
        }

        cartItemRepository.delete(cartItem);

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
    }

    @Transactional
    public void clearCart() {

        Long userId = currentUserService.getCurrentUserId();

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cartItemRepository.deleteByCartId(cart.getId());

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
    }

}
