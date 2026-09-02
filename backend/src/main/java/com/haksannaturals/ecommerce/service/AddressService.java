package com.haksannaturals.ecommerce.service;

import com.haksannaturals.ecommerce.dto.AddressRequest;
import com.haksannaturals.ecommerce.dto.AddressResponse;
import com.haksannaturals.ecommerce.entity.Address;
import com.haksannaturals.ecommerce.entity.User;
import com.haksannaturals.ecommerce.repository.AddressRepository;
import com.haksannaturals.ecommerce.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final CurrentUserService currentUserService;

    @Transactional
    public AddressResponse createAddress(AddressRequest request) {

        Long userId = currentUserService.getCurrentUserId();

        User user = User.builder()
                .id(userId)
                .build();

        LocalDateTime now = LocalDateTime.now();

        Address address = Address.builder()
                .user(user)
                .name(request.getName())
                .phone(request.getPhone())
                .addressLine(request.getAddressLine())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .createdAt(now)
                .updatedAt(now)
                .build();

        Address savedAddress = addressRepository.save(address);

        return mapToResponse(savedAddress);
    }

    @Transactional(readOnly = true)
    public List<AddressResponse> getMyAddresses() {

        Long userId = currentUserService.getCurrentUserId();

        return addressRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public AddressResponse updateAddress(
            Long addressId,
            AddressRequest request
    ) {

        Long userId = currentUserService.getCurrentUserId();

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() ->
                        new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException(
                    "Address does not belong to the user"
            );
        }

        address.setName(request.getName());
        address.setPhone(request.getPhone());
        address.setAddressLine(request.getAddressLine());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address.setUpdatedAt(LocalDateTime.now());

        Address updatedAddress = addressRepository.save(address);

        return mapToResponse(updatedAddress);
    }

    @Transactional
    public void deleteAddress(Long addressId) {

        Long userId = currentUserService.getCurrentUserId();

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() ->
                        new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException(
                    "Address does not belong to the user"
            );
        }

        addressRepository.delete(address);
    }

    private AddressResponse mapToResponse(Address address) {

        return AddressResponse.builder()
                .id(address.getId())
                .name(address.getName())
                .phone(address.getPhone())
                .addressLine(address.getAddressLine())
                .city(address.getCity())
                .state(address.getState())
                .pincode(address.getPincode())
                .createdAt(address.getCreatedAt())
                .updatedAt(address.getUpdatedAt())
                .build();
    }
}