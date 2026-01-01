package com.backend.backend.service;

public interface EmailService {
    void sendSimpleEmail(String to, String subject, String body);
}