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
import com.backend.backend.repository.VoteRepository;
import com.backend.backend.service.ForumService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ForumServiceImpl implements ForumService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final VoteRepository voteRepository;
    private final EmailService emailService;

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
        if (!post.getUser().getId().equals(user.getId())) {
            String subject = "New Comment on your Post 💬";
            String body = "Hi " + post.getUser().getName() + ",\n\n" +
                          user.getName() + " commented on your post '" + post.getTitle() + "':\n\n" +
                          "\"" + savedComment.getContent() + "\"";

            emailService.sendSimpleEmail(post.getUser().getEmail(), subject, body);
        }

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
        dto.setVoteCount(post.getVoteCount());
        dto.setViewCount(post.getViewCount());
        dto.setCreationDate(post.getCreationDate());
        dto.setUserName(post.getUser().getName());
        dto.setUserId(post.getUser().getId());

         if (post.getUser() != null) {
            dto.setUserName(post.getUser().getName());
        }
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
        dto.setAccepted(comment.isAccepted());
        return dto;
    }
    @Override
    @Transactional
    public void votePost(Long postId, com.backend.backend.dto.VoteDto voteDto) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User currentUser = getCurrentUser(); // Helper method reuse

        // Check if vote already exists
        java.util.Optional<com.backend.backend.entity.Vote> existingVoteOpt =
                voteRepository.findByPostAndUser(post, currentUser);

        if (existingVoteOpt.isPresent()) {
            com.backend.backend.entity.Vote vote = existingVoteOpt.get();
            if (vote.getVoteType().equals(voteDto.getVoteType())) {
                voteRepository.delete(vote);
                // Update count
                if (voteDto.getVoteType() == com.backend.backend.entity.VoteType.UPVOTE) {
                    post.setVoteCount(post.getVoteCount() - 1);
                } else {
                    post.setVoteCount(post.getVoteCount() + 1);
                }
            } else {
                vote.setVoteType(voteDto.getVoteType());
                voteRepository.save(vote);
                // Update count logic (+2 or -2 swing)
                if (voteDto.getVoteType() == com.backend.backend.entity.VoteType.UPVOTE) {
                    post.setVoteCount(post.getVoteCount() + 2);
                } else {
                    post.setVoteCount(post.getVoteCount() - 2);
                }
            }
        } else {
            // New Vote creation
            com.backend.backend.entity.Vote newVote = com.backend.backend.entity.Vote.builder()
                    .post(post)
                    .user(currentUser)
                    .voteType(voteDto.getVoteType())
                    .build();
            voteRepository.save(newVote);

            // Update count
            if (voteDto.getVoteType() == com.backend.backend.entity.VoteType.UPVOTE) {
                post.setVoteCount(post.getVoteCount() + 1);
            } else {
                post.setVoteCount(post.getVoteCount() - 1);
            }
        }
        postRepository.save(post);
    }
    @Override
    public List<PostResponseDto> searchPosts(String query, String category) {
        List<Post> posts;

        if (query != null && !query.isEmpty()) {
            posts = postRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(query, query);
        } else if (category != null && !category.isEmpty()) {
            posts = postRepository.findByCategory(category);
        } else {
            posts = postRepository.findAll();
        }

        return posts.stream().map(this::mapToPostResponse).collect(Collectors.toList());
    }

    @Override
    public void markCommentAsAccepted(Long postId, Long commentId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User currentUser = getCurrentUser();

        // Security Check: Only Post Owner can mark answer as accepted
        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only the author of the post can mark an answer as accepted.");
        }

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setAccepted(true);
        commentRepository.save(comment);
    }
    @Override
    public void deletePost(Long postId) {
        // 1. Get Current User
        User currentUser = getCurrentUser();

        // 2. Find Post
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

        // 3. Security Check: Is Owner OR Admin?
        boolean isOwner = post.getUser().getId().equals(currentUser.getId());
        // Check Admin Role (safely)
        boolean isAdmin = currentUser.getRole().name().equals("ADMIN");

        if (!isOwner && !isAdmin) {
            throw new org.springframework.security.access.AccessDeniedException("You are not authorized to delete this post.");
        }

        //  ADMIN DELETE NOTIFICATION
        if (isAdmin && !isOwner) {
            String subject = "Post Deleted by Admin ⚠️";
            String body = "Hi " + post.getUser().getName() + ",\n\nYour post '" + post.getTitle() + "' was deleted by the Administrator due to violation of community guidelines.";
            emailService.sendSimpleEmail(post.getUser().getEmail(), subject, body);
        }

        postRepository.delete(post);
    }

    @Override
    public void deleteComment(Long postId, Long commentId) {
        // 1. Get Current User
        User currentUser = getCurrentUser();

        // 2. Find Comment
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));

        // Validation: Comment belongs to post?
        if (!comment.getPost().getId().equals(postId)) {
            throw new RuntimeException("Comment does not belong to the specified post.");
        }

        // 3. Security Check: Is Comment Owner OR Admin?
        boolean isOwner = comment.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole().name().equals("ADMIN");

        if (!isOwner && !isAdmin) {
            throw new org.springframework.security.access.AccessDeniedException("You are not authorized to delete this comment.");
        }

        // 👇 ADMIN DELETE NOTIFICATION
        if (isAdmin && !isOwner) {
            String subject = "Comment Deleted by Admin ⚠️";
            String body = "Hi " + comment.getUser().getName() + ",\n\nYour comment on the post '" + comment.getPost().getTitle() + "' was removed by the Administrator.";
            emailService.sendSimpleEmail(comment.getUser().getEmail(), subject, body);
        }
        commentRepository.delete(comment);
    }
}