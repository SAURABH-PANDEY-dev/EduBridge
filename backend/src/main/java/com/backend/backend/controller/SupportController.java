package com.backend.backend.controller;

import com.backend.backend.dto.SupportReplyDto;
import com.backend.backend.dto.SupportRequestDto;
import com.backend.backend.dto.SupportResponseDto;
import com.backend.backend.service.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller to handle all Support and Feedback related operations.
 * Segregates endpoints for generic users (Students) and Administrators.
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SupportController {

    private final SupportService supportService;

    // ========================================================================
    // STUDENT / USER ENDPOINTS
    // ========================================================================

    /**
     * Endpoint for students to create a new support ticket.
     * * @param requestDto Contains the subject and the message/query from the user.
     * @return The created ticket details including the generated Ticket ID and status (OPEN).
     */
    @PostMapping("/support")
    public ResponseEntity<SupportResponseDto> createTicket(@RequestBody SupportRequestDto requestDto) {
        SupportResponseDto response = supportService.createTicket(requestDto);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint for the logged-in user to view their own ticket history.
     * Useful for tracking the status of their previous queries.
     * * @return List of support tickets belonging specifically to the current user.
     */
    @GetMapping("/support/my-tickets")
    public ResponseEntity<List<SupportResponseDto>> getMyTickets() {
        List<SupportResponseDto> tickets = supportService.getMyTickets();
        return ResponseEntity.ok(tickets);
    }

    // ========================================================================
    // ADMIN ENDPOINTS
    // ========================================================================

    /**
     * Endpoint for Administrators to view all support tickets in the system.
     * Ordered by creation date (newest first).
     * * @return List of all tickets from all users.
     */
    @GetMapping("/admin/support")
    public ResponseEntity<List<SupportResponseDto>> getAllTickets() {
        List<SupportResponseDto> tickets = supportService.getAllTickets();
        return ResponseEntity.ok(tickets);
    }

    /**
     * Endpoint for Administrators to reply to a specific ticket.
     * This action will:
     * 1. Update the 'adminReply' field in the database.
     * 2. Change the status from 'OPEN' to 'RESOLVED'.
     * 3. Trigger an email notification to the student.
     * * @param id The ID of the ticket to resolve.
     * @param replyDto Contains the admin's reply message.
     * @return The updated ticket details.
     */
    @PutMapping("/admin/support/{id}/reply")
    public ResponseEntity<SupportResponseDto> resolveTicket(
            @PathVariable Long id,
            @RequestBody SupportReplyDto replyDto
    ) {
        SupportResponseDto response = supportService.resolveTicket(id, replyDto);
        return ResponseEntity.ok(response);
    }
}