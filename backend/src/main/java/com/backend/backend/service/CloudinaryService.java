package com.backend.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class CloudinaryService {

    @Resource
    private Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) {
        try {
            // Default setup for Images
            String resourceType = "auto";
            Map<String, Object> options = new HashMap<>();

            String originalFileName = file.getOriginalFilename();

            // LOGIC FOR PDF ONLY
            if (originalFileName != null && originalFileName.toLowerCase().endsWith(".pdf")) {
                resourceType = "raw";
                String cleanName = originalFileName.replace(".pdf", "").replaceAll("\\s+", "_");

                // 3. Unique ID + .pdf extension manually
                // Example Result: "Java_Notes_1735575000.pdf"
                String newFileName = cleanName + "_" + System.currentTimeMillis() + ".pdf";

                options.put("public_id", newFileName);
                options.put("unique_filename", false);
            }

            options.put("resource_type", resourceType);

            // Upload Process
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);

            // Return Secure URL
            return (String) uploadResult.get("secure_url");

        } catch (IOException e) {
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }
}