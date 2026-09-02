package com.haksannaturals.ecommerce.controller;

import com.haksannaturals.ecommerce.dto.ProductUpdateRequest;
import com.haksannaturals.ecommerce.entity.Product;
import com.haksannaturals.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<Product> getProducts() {
        return productService.getActiveProducts();
    }

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        return productService.getActiveProductById(id);
    }
}
