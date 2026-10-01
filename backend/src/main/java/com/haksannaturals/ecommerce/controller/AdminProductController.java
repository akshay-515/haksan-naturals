package com.haksannaturals.ecommerce.controller;

import com.haksannaturals.ecommerce.dto.ProductCreateRequest;
import com.haksannaturals.ecommerce.dto.ProductUpdateRequest;
import com.haksannaturals.ecommerce.entity.Product;
import com.haksannaturals.ecommerce.service.ProductService;
import com.haksannaturals.ecommerce.storage.ImageStorageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;
    private final ImageStorageService imageStorageService;

    @PostMapping
    public ResponseEntity<Product> createProduct(
            @Valid @RequestBody ProductCreateRequest request
    ) {

        Product product = productService.createProduct(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(product);
    }

    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file
    ) {
        String imageUrl = imageStorageService.upload(file);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("imageUrl", imageUrl));
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