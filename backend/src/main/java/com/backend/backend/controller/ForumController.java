package com.backend.backend.controller;

import com.backend.backend.dto.CommentDto;
import com.backend.backend.dto.CommentResponseDto;
import com.backend.backend.dto.PostDto;
import com.backend.backend.dto.PostResponseDto;
import com.backend.backend.service.ForumService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forum")
@AllArgsConstructor
public class ForumController {

    private final ForumService forumService;

    // 1. Create a new Post
    @PostMapping("/posts")
    public ResponseEntity<PostResponseDto> createPost(@RequestBody PostDto postDto) {
        return new ResponseEntity<>(forumService.createPost(postDto), HttpStatus.CREATED);
    }

    // 2. Get All Posts (Feed)
    @GetMapping("/posts")
    public ResponseEntity<List<PostResponseDto>> getAllPosts() {
        return new ResponseEntity<>(forumService.getAllPosts(), HttpStatus.OK);
    }

    // 3. Add a Comment
    @PostMapping("/comments")
    public ResponseEntity<CommentResponseDto> addComment(@RequestBody CommentDto commentDto) {
        return new ResponseEntity<>(forumService.addComment(commentDto), HttpStatus.CREATED);
    }

    // 4. Get Comments for a specific Post
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<CommentResponseDto>> getPostComments(@PathVariable Long postId) {
        return new ResponseEntity<>(forumService.getCommentsByPost(postId), HttpStatus.OK);
    }

    // 5. Vote on a Post (Upvote/Downvote)
    // URL: POST /api/forum/posts/{postId}/vote
    @PostMapping("/posts/{postId}/vote")
    public ResponseEntity<String> votePost(
            @PathVariable Long postId,
            @RequestBody com.backend.backend.dto.VoteDto voteDto) {

        forumService.votePost(postId, voteDto);
        return new ResponseEntity<>("Vote recorded successfully.", HttpStatus.OK);
    }

    // 6. Search and Filter Posts
    // URL: GET /api/forum/search?query=java&category=Doubt
    @GetMapping("/search")
    public ResponseEntity<List<PostResponseDto>> searchPosts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category) {

        return new ResponseEntity<>(forumService.searchPosts(query, category), HttpStatus.OK);
    }

    // 7. Mark Comment as "Best Answer" (Accepted)
    // URL: PUT /api/forum/posts/{postId}/comments/{commentId}/accept
    @PutMapping("/posts/{postId}/comments/{commentId}/accept")
    public ResponseEntity<String> markAsAccepted(
            @PathVariable Long postId,
            @PathVariable Long commentId) {

        forumService.markCommentAsAccepted(postId, commentId);
        return new ResponseEntity<>("Answer marked as accepted!", HttpStatus.OK);
    }
}