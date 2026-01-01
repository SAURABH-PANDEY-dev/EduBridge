package com.backend.backend.service;

import com.backend.backend.dto.CommentDto;
import com.backend.backend.dto.CommentResponseDto;
import com.backend.backend.dto.PostDto;
import com.backend.backend.dto.PostResponseDto;
import java.util.List;

public interface ForumService {
    // Create a new post
    PostResponseDto createPost(PostDto postDto);

    // Get all posts (Latest first)
    List<PostResponseDto> getAllPosts();

    // Add a comment to a post
    CommentResponseDto addComment(CommentDto commentDto);

    // Get all comments for a specific post
    List<CommentResponseDto> getCommentsByPost(Long postId);

    // Vote on a Post (Upvote/Downvote)
    void votePost(Long postId, com.backend.backend.dto.VoteDto voteDto);

    // Search and Filter Posts
    java.util.List<com.backend.backend.dto.PostResponseDto> searchPosts(String query, String category);

    // Mark a Comment as "Best Answer" (Solved)
    void markCommentAsAccepted(Long postId, Long commentId);
    void deletePost(Long postId);
    void deleteComment(Long postId, Long commentId);
}