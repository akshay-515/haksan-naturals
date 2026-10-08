package com.haksannaturals.ecommerce.storage;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.util.UUID;

@Service
@Profile("cloud")
@RequiredArgsConstructor
public class SupabaseImageStorageService implements ImageStorageService {

    private final S3Client supabaseS3Client;

    @Value("${supabase.storage.bucket}")
    private String bucketName;

    @Value("${supabase.storage.public-url}")
    private String publicUrl;

    @Override
    public String upload(MultipartFile file) {

        try {

            String originalFilename = file.getOriginalFilename();

            String extension = "";

            if (originalFilename != null &&
                    originalFilename.contains(".")) {

                extension =
                        originalFilename.substring(
                                originalFilename.lastIndexOf(".")
                        );
            }

            String objectName =
                    UUID.randomUUID() + extension;

            PutObjectRequest request =
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(objectName)
                            .contentType(file.getContentType())
                            .build();

            supabaseS3Client.putObject(
                    request,
                    RequestBody.fromInputStream(
                            file.getInputStream(),
                            file.getSize()
                    )
            );

            return publicUrl + "/" + objectName;

        } catch (Exception exception) {

            throw new RuntimeException(
                    "Failed to upload image to Supabase Storage",
                    exception
            );
        }
    }

    @Override
    public void delete(String imageUrl) {
        // We'll implement this after upload is verified.
    }
}