package com.backend.backend.dto;

import com.backend.backend.entity.VoteType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VoteDto {
    private VoteType voteType; // UPVOTE or DOWNVOTE
}