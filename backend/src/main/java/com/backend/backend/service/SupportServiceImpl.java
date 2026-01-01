package com.backend.backend.service;

import com.backend.backend.dto.SupportReplyDto;
import com.backend.backend.dto.SupportRequestDto;
import com.backend.backend.dto.SupportResponseDto;
import com.backend.backend.entity.SupportTicket;
import com.backend.backend.entity.User;
import com.backend.backend.repository.SupportTicketRepository;
import com.backend.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupportServiceImpl implements SupportService {

    private final SupportTicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final EmailService emailService; // 📧 Email Service Injected

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public SupportResponseDto createTicket(SupportRequestDto requestDto) {
        User user = getCurrentUser();

        SupportTicket ticket = SupportTicket.builder()
                .user(user)
                .subject(requestDto.getSubject())
                .message(requestDto.getMessage())
                .status("OPEN") // Default status
                .build();

        SupportTicket savedTicket = ticketRepository.save(ticket);

        // for the confirmation mail
         emailService.sendSimpleEmail(user.getEmail(), "Support Ticket Received", "Ticket ID: " + savedTicket.getId());

        return mapToDto(savedTicket);
    }

    @Override
    public List<SupportResponseDto> getMyTickets() {
        User user = getCurrentUser();
        return ticketRepository.findByUserId(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SupportResponseDto> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public SupportResponseDto resolveTicket(Long ticketId, SupportReplyDto replyDto) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // Update fields
        ticket.setAdminReply(replyDto.getReplyMessage());
        ticket.setStatus("RESOLVED");
        ticket.setResolvedAt(LocalDateTime.now());

        ticketRepository.save(ticket);

        // 👇 EMAIL TRIGGER LOGIC (Magic happens here)
        String subject = "Update on your Support Request #" + ticket.getId();
        String body = "Hi " + ticket.getUser().getName() + ",\n\n" +
                "The Administrator has responded to your query regarding '" + ticket.getSubject() + "'.\n\n" +
                "Admin Response:\n\"" + replyDto.getReplyMessage() + "\"\n\n" +
                "Status: RESOLVED ✅";

        emailService.sendSimpleEmail(ticket.getUser().getEmail(), subject, body);

        return mapToDto(ticket);
    }

    // Mapper Method
    private SupportResponseDto mapToDto(SupportTicket ticket) {
        return SupportResponseDto.builder()
                .id(ticket.getId())
                .userName(ticket.getUser().getName())
                .userEmail(ticket.getUser().getEmail())
                .subject(ticket.getSubject())
                .message(ticket.getMessage())
                .adminReply(ticket.getAdminReply())
                .status(ticket.getStatus())
                .createdAt(ticket.getCreatedAt())
                .resolvedAt(ticket.getResolvedAt())
                .build();
    }
}