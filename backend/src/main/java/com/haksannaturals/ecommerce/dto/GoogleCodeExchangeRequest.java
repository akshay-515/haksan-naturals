
package com.haksannaturals.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoogleCodeExchangeRequest {

    @NotBlank
    @Size(max = 100)
    private String code;
}
