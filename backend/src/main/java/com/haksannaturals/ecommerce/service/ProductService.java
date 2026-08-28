package com.haksannaturals.ecommerce.service;

import com.haksannaturals.ecommerce.entity.Product;
import com.haksannaturals.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public List<Product> getActiveProducts() {
        return productRepository.findByActiveTrue();
    }

    public Product getActiveProductById(Long id) {

        return productRepository.findById(id)
                .filter(Product::isActive)
                .orElseThrow(() -> new RuntimeException("Product not found "));
    }
}
