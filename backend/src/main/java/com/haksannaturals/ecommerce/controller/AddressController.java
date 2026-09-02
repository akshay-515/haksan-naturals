package com.haksannaturals.ecommerce.controller;

import com.haksannaturals.ecommerce.dto.AddressRequest;
import com.haksannaturals.ecommerce.dto.AddressResponse;
import com.haksannaturals.ecommerce.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @PostMapping
    public ResponseEntity<AddressResponse> createAddress(
            @Valid @RequestBody AddressRequest request
    ) {

        AddressResponse response =
                addressService.createAddress(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getMyAddresses() {

        List<AddressResponse> addresses =
                addressService.getMyAddresses();

        return ResponseEntity.ok(addresses);
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Long addressId,
            @Valid @RequestBody AddressRequest request
    ) {

        AddressResponse response =
                addressService.updateAddress(addressId, request);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Long addressId
    ) {

        addressService.deleteAddress(addressId);

        return ResponseEntity.noContent().build();
    }
}