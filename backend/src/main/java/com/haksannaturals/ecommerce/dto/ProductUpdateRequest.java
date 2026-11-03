package com.haksannaturals.ecommerce.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductUpdateRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    @DecimalMin(value = "0.01", message = "Discounted price must be greater than 0")
    private BigDecimal discountedPrice;

    @AssertTrue(message = "Discounted price must be less than the original price")
    public boolean isDiscountedPriceValid() {
        return discountedPrice == null
                || price == null
                || discountedPrice.compareTo(price) < 0;
    }

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;
}