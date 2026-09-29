package com.haksannaturals.ecommerce.controller;

import com.haksannaturals.ecommerce.dto.ProductCreateRequest;
import com.haksannaturals.ecommerce.dto.ProductUpdateRequest;
import com.haksannaturals.ecommerce.entity.Product;
import com.haksannaturals.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<Product> createProduct(
            @Valid @RequestBody ProductCreateRequest request
    ) {

        Product product = productService.createProduct(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(product);
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(
                productService.getAllProductsForAdmin()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateRequest request
    ) {

        Product product = productService.updateProduct(id, request);
        return ResponseEntity.ok(product);
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<Void> activateProduct(@PathVariable Long id) {
        productService.activateProduct(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateProduct(
            @PathVariable Long id
    ) {

        productService.deactivateProduct(id);
        return ResponseEntity.noContent().build();
    }
}