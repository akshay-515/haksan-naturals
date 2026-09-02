package com.haksannaturals.ecommerce.controller;

import com.haksannaturals.ecommerce.dto.CartItemRequest;
import com.haksannaturals.ecommerce.dto.CartResponse;
import com.haksannaturals.ecommerce.entity.Cart;
import com.haksannaturals.ecommerce.entity.CartItem;
import com.haksannaturals.ecommerce.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart() {

        CartResponse cart = cartService.getCartResponse();

        return ResponseEntity.ok(cart);
    }

    @PostMapping("/items")
    public ResponseEntity<CartItem> addToCart(
            @Valid @RequestBody CartItemRequest request
    ) {

        CartItem cartItem = cartService.addToCart(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(cartItem);
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartItem> updateQuantity(
            @PathVariable Long itemId,
            @RequestParam Integer quantity
    ) {

        CartItem cartItem = cartService.updateQuantity(itemId, quantity);

        return ResponseEntity.ok(cartItem);
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeItem(
            @PathVariable Long itemId
    ) {

        cartService.removeItem(itemId);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart() {

        cartService.clearCart();

        return ResponseEntity.noContent().build();
    }
}