package com.haksannaturals.ecommerce.controller;

import com.haksannaturals.ecommerce.storage.ImageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductImageController {

    private final ImageStorageService imageStorageService;

    @PostMapping(
            value = "/image",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file
    ) {
        String imageUrl = imageStorageService.upload(file);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("imageUrl", imageUrl));
    }
}