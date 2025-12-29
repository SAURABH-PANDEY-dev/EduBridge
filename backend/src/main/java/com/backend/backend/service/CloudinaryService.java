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

    public void deleteFile(String fileUrl) {
        try {
            // 1. Extract Public ID from URL
            //  format: .../raw/upload/v12345678/filename.pdf
            // We need just "filename.pdf"
            String publicId = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);

            // 2. Delete from Cloudinary (Specify 'raw' because we uploaded it as raw)
            Map options = ObjectUtils.asMap("resource_type", "raw");
            cloudinary.uploader().destroy(publicId, options);

        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file from Cloudinary: " + e.getMessage());
        }
    }
}