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
}