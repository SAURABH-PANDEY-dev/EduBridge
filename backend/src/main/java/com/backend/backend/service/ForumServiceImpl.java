package com.backend.backend.service;

import com.backend.backend.dto.CommentDto;
import com.backend.backend.dto.CommentResponseDto;
import com.backend.backend.dto.PostDto;
import com.backend.backend.dto.PostResponseDto;
import com.backend.backend.entity.Comment;
import com.backend.backend.entity.Post;
import com.backend.backend.entity.User;
import com.backend.backend.repository.CommentRepository;
import com.backend.backend.repository.PostRepository;
import com.backend.backend.repository.UserRepository;
import com.backend.backend.service.ForumService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ForumServiceImpl implements ForumService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    // Helper to get currently logged-in user
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    public PostResponseDto createPost(PostDto postDto) {
        User user = getCurrentUser();

        Post post = new Post();
        post.setTitle(postDto.getTitle());
        post.setContent(postDto.getContent());
        post.setCategory(postDto.getCategory());
        post.setUser(user);

        Post savedPost = postRepository.save(post);
        return mapToPostResponse(savedPost);
    }

    @Override
    public List<PostResponseDto> getAllPosts() {
        List<Post> posts = postRepository.findAllByOrderByCreationDateDesc();
        return posts.stream().map(this::mapToPostResponse).collect(Collectors.toList());
    }

    @Override
    public CommentResponseDto addComment(CommentDto commentDto) {
        User user = getCurrentUser();

        Post post = postRepository.findById(commentDto.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + commentDto.getPostId()));

        Comment comment = new Comment();
        comment.setContent(commentDto.getContent());
        comment.setPost(post);
        comment.setUser(user);

        Comment savedComment = commentRepository.save(comment);
        return mapToCommentResponse(savedComment);
    }

    @Override
    public List<CommentResponseDto> getCommentsByPost(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        return comments.stream().map(this::mapToCommentResponse).collect(Collectors.toList());
    }

    // --- Mappers ---

    private PostResponseDto mapToPostResponse(Post post) {
        PostResponseDto dto = new PostResponseDto();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setCategory(post.getCategory());
        dto.setCreationDate(post.getCreationDate());
        dto.setUserName(post.getUser().getName());
        dto.setUserId(post.getUser().getId());
        // Handling null comments list safely
        dto.setCommentCount(post.getComments() != null ? post.getComments().size() : 0);
        return dto;
    }

    private CommentResponseDto mapToCommentResponse(Comment comment) {
        CommentResponseDto dto = new CommentResponseDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreationDate(comment.getCreationDate());
        dto.setUserName(comment.getUser().getName());
        dto.setUserId(comment.getUser().getId());
        return dto;
    }
}