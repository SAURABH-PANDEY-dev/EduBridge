package com.backend.backend.service;

import com.backend.backend.dto.SupportReplyDto;
import com.backend.backend.dto.SupportRequestDto;
import com.backend.backend.dto.SupportResponseDto;
import java.util.List;

public interface SupportService {
    SupportResponseDto createTicket(SupportRequestDto requestDto);
    List<SupportResponseDto> getMyTickets();
    List<SupportResponseDto> getAllTickets();
    SupportResponseDto resolveTicket(Long ticketId, SupportReplyDto replyDto);
}