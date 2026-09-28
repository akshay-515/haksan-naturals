package com.haksannaturals.ecommerce.controller;

import com.haksannaturals.ecommerce.dto.CartItemRequest;
import com.haksannaturals.ecommerce.dto.CartResponse;
import com.haksannaturals.ecommerce.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<CartResponse> addToCart(
            @Valid @RequestBody CartItemRequest request
    ) {

        cartService.addToCart(request);

        return ResponseEntity.ok(
                cartService.getCartResponse()
        );
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateQuantity(
            @PathVariable Long itemId,
            @RequestParam Integer quantity
    ) {

        cartService.updateQuantity(itemId, quantity);

        return ResponseEntity.ok(
                cartService.getCartResponse()
        );
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> removeItem(
            @PathVariable Long itemId
    ) {

        cartService.removeItem(itemId);

        return ResponseEntity.ok(
                cartService.getCartResponse()
        );
    }

    @DeleteMapping
    public ResponseEntity<CartResponse> clearCart() {

        cartService.clearCart();

        return ResponseEntity.ok(
                cartService.getCartResponse()
        );
    }
}