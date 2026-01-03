# EduBridge API Documentation

This document serves as a contract between the Backend and Frontend.
**Base URL:** `http://localhost:8080/api`

---

## 1. User Authentication

### A. Register User
Used to create a new account (Student or Admin).

* **Endpoint:** `/auth/register`
* **Method:** `POST`
* **Content-Type:** `application/json`
* **Note: Role must be either "STUDENT" or "ADMIN" (Uppercase).**

**Request Body (JSON to send from Frontend):**
```json
{
  "name": "Saurabh Pandey",
  "email": "saurabh@example.com",
  "password": "securePassword123",
  "role": "STUDENT"
}
```

Success Response (200 OK):
```json
{
  "id": 1,
  "name": "Saurabh Pandey",
  "email": "saurabh@example.com",
  "role": "STUDENT"
}
```
<hr>
### B. Login User
Used to authenticate a user and receive a JWT Token.

* **Endpoint:** `/auth/login`
* **Method:** `POST`
* **Content-Type:** `application/json`

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "password123"
}
```
**Success Response (200 OK):**<br>
Returns a JWT Token string :
```
"Example" : eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJzdHVkZW50QGV4YW1wbGUuY29tIiwiaWF0IjoxNzY2OTE1NDU0LCJleHAiOjE3NjcwMDE4NTR9.7y4Wxk3sxLSW4uqfak4ReXoTyArenoX6WaLg7Tv0x9vshnl1Tg3_L9m1KiBB-k0N
This token must be included in the header of all future requests: Authorization: Bearer <token>
```
<hr>
### C. Change Password
Allows a logged-in user to change their password.

* **Endpoint:** `/api/users/change-password`
* **Method:** `POST`
* **Headers:**
    * `Authorization`: `Bearer <your_token_here>`
* **Content-Type:** `application/json`

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword789",
  "confirmationPassword": "newPassword789"
}
```

**Success Response (200 OK):** Password changed successfully!
<hr>

### D. Password Reset (Forgot Password)
For users who cannot log in.

**1. Request Token (Send Email)**
* **Endpoint:** `/api/users/forgot-password`
* **Method:** `POST`
* **Body:**
```json
{ "email": "student@example.com" }
```
**2. Reset Password (Using Token)**

* **Endpoint:** `/api/users/reset-password`
* **Method:** `POST`
* **Body:**
```JSON
{
"token": "49fd469b-ab6f...",
"newPassword": "newPass123",
"confirmPassword": "newPass123"
}
```
<hr>

### 📂 Material Management

### 1. Upload Material 
Uploads a file (PDF/Image) to Cloudinary. PDFs are stored in the 'raw' bucket with `.pdf` extension preserved.
* **URL:** `/api/materials/upload`
* **Method:** `POST`
* **Content-Type:** `multipart/form-data`
* **Headers:**  `Authorization`: Bearer <Token>
* **Body (Form Data):**
  * `file`: (File) - The file.
  * `title`: (String)
  * `description`: (String)
  * `subject`: (String)
* **Response (201 Created):**
```json
{
  "id": 15,
  "title": "Java Notes",
  "description": "Chapter 1",
  "fileUrl": "[https://res.cloudinary.com/.../raw/upload/v1234/Java_Notes_176702.pdf](https://res.cloudinary.com/.../raw/upload/v1234/Java_Notes_176702.pdf)",
  "uploadedBy": "Student Name",
  "uploadDate": "2025-12-30T10:00:00",
  "status": "PENDING"
}
```
<hr>

### 2. Get Pending Materials (Admin Only)
   Fetches a list of all materials waiting for approval.

* **Endpoint:** `/api/materials/pending`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <Admin_Token>`

**Response (200 OK):**
```JSON
[
  {
    "id": 15,
    "title": "Java Notes",
    "subject": "Java",
    "status": "PENDING",
    "fileUrl": "...",
    "uploadedBy": "Student Name"
  }
]
```

<hr>

### Approve Material
Changes the status of a material from PENDING to APPROVED.
- **Endpoint:** `/api/materials/{id}/approve`
- **Method:** `PUT`
- **Auth Required:** Yes (ROLE_ADMIN)
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `"Material approved successfully."`

```text
Add Note: "Sends an approval email to the student who uploaded the material.
```
<hr>

### Delete Material
Permanently removes a material from the database and deletes the associated file from Cloudinary.
- **Endpoint:** `/api/materials/{id}`
- **Method:** `DELETE`
- **Auth Required:** Yes (ROLE_ADMIN)
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `"Material and associated file deleted successfully."`
```text
Add Note: "If deleted by Admin, an alert email is sent to the content owner."
````
<hr>
<hr>
<hr>

### 3. Search & Filter Materials
    
### Test1
Allows students to filter approved materials by metadata or text search.
* **Endpoint:** `/api/materials/search`
* **Method:** `GET`
* **Auth Required:** No (Public)
* **Query Parameters (All Optional):**
    * `subject`: Exact match (e.g., "Java")
    * `semester`: Exact match (e.g., "Semester 1")
    * `type`: Exact match (e.g., "NOTE", "PYQ")
    * `query`: Partial text search in Title or Description
* **Success Response:**
    - **Code:** 200 OK
    - **Content:** List of `MaterialResponseDto` objects.

### Test 2
Search materials by metadata or text.
* **Endpoint:** `/api/materials/search`
* **Method:** `GET`
* **Auth Required:** No (Public)
* **Query Parameters:**
    * `subject`: Exact subject name (e.g., `Java`)
    * `semester`: Semester name (e.g., `Semester%201` - URL Encoded)
    * `type`: Material type (e.g., `NOTE`, `PYQ`)
    * `query`: Search text in Title/Description
* **Example URL:** `/api/materials/search?subject=Java&semester=Semester%201`
* **Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Java Basics",
    "semester": "Semester 1",
    "type": "NOTE",
    "fileUrl": "...",
    "status": "APPROVED"
  }
]
```
<hr>

### 4. Download Material
Increments the download count and redirects the user to the file URL.
* **Endpoint:** `/api/materials/{id}/download`
* **Method:** `GET`
* **Auth Required:** No (Public)
* **Response:**
  - **Code:** 302 FOUND (Redirects to Cloudinary URL)

<hr>

### 5. Add Review
Allows a student to rate (1-5) and review a material.
* **Endpoint:** `/api/materials/{id}/reviews`
* **Method:** `POST`
* **Auth Required:** Yes (Role: STUDENT)
* **Body:**
```json
{
  "rating": 5,
  "comment": "Notes acche hain bhai!"
}
```

### Success Response (201 Created):
```JSON
{
"id": 1,
"rating": 5,
"comment": "Notes acche hain bhai!",
"userName": "Rocky Bhai",
"createdAt": "2025-12-31T12:00:00"
}
```
---
### 7. Update Material Metadata
* **Endpoint:** `/api/materials/{id}`
* **Method:** `PUT`
* **Description:** Updates the details (metadata) of an existing material. The file itself cannot be changed here.
* **Permissions:**
  * **Owner:** Can update their own material.
  * **ADMIN:** Can update any material (triggers an email notification to the owner).
* **Headers:**
  * `Authorization`: `Bearer <token>`
  * `Content-Type`: `application/json`
* **Request Body:**
    ```json
    {
      "title": "Java Complete Notes (Revised)",
      "description": "Updated description with new topics.",
      "subject": "Java",
      "semester": "Semester 2",
      "year": "2nd Year",
      "type": "NOTE"
    }
    ```
* **Response (200 OK):** Returns the updated material object.

<hr>
<hr>
<hr>

# 💬 Discussion Forum

### 1. Create Post
* **Endpoint:** `/api/forum/posts`
* **Method:** `POST`
* **Auth Required:** Yes
* **Body:**
  ```json
  {
    "title": "Question Title",
    "content": "Details...",
    "category": "Doubt"
  }
  ```

<hr>

### 2. Create Post
* **Endpoint:** `/api/forum/posts`
* **Method:** `GET`
* **Auth Required:** Yes
<hr>

### 3. Add Comment
* **Endpoint:** `/api/forum/comments`
* **Method:** `POST`
* **Auth Required:** Yes
* **Body:**
```JSON
{
"content": "My answer...",
"postId": 1
}
```
```text
Add Note: "Sends an email notification to the post author (unless the author is commenting on their own post)."
```
<hr>

### 4. Get Post Comments
* **Endpoint:** `/api/forum/posts/{postId}/comments`
* **Method:** `GET`
* **Auth Required:** Yes

<hr>

### FORUM & COMMUNITY MODULE (Part 2 - Advanced Features)

### 1. Vote on a Post (Upvote/Downvote)
* **Endpoint:** `/api/forum/posts/{postId}/vote`
* **Method:** `POST`
* **Description:** Allows a user to upvote or downvote a post. Toggles the vote if clicked again (e.g., Upvote → Remove Upvote).
* **Headers:**
  * `Authorization`: `Bearer <token>`
* **Path Parameters:**
  * `postId`: ID of the post to vote on.
* **Request Body (JSON):**
    ```json
    {
      "voteType": "UPVOTE" 
    }
    ```
* **Response (200 OK):**
    ```text
    Vote recorded successfully.
    ```

---

### 2. Search and Filter Posts
* **Endpoint:** `/api/forum/search`
* **Method:** `GET`
* **Description:** Search posts by title/content keyword OR filter by category.
* **Headers:**
  * `Authorization`: `Bearer <token>`
* **Query Parameters:**
  * `query`: (Optional) Text to search in Title or Content (e.g., `?query=loops`).
  * `category`: (Optional) Filter by category name (e.g., `?category=Doubt`).
* **Response (200 OK):**
    ```json
    [
      {
        "id": 5,
        "title": "Java Loops doubt",
        "content": "Difference between for and while?",
        "category": "Doubt",
        "userName": "Rocky Bhai",
        "voteCount": 10,
        "viewCount": 5,
        "commentCount": 3,
        "creationDate": "2025-12-31T10:00:00"
      }
    ]
    ```

---

### 3. Mark Comment as Best Answer (Solved)
* **Endpoint:** `/api/forum/posts/{postId}/comments/{commentId}/accept`
* **Method:** `PUT`
* **Description:** Marks a specific comment as the "Accepted Answer". Only the **Post Owner** can perform this action.
* **Headers:**
  * `Authorization`: `Bearer <token>`
* **Path Parameters:**
  * `postId`: ID of the post.
  * `commentId`: ID of the comment to mark as accepted.
* **Response (200 OK):**
    ```text
    Answer marked as accepted!
    ```
---
### 4. Delete a Post
* **Endpoint:** `/api/forum/posts/{postId}`
* **Method:** `DELETE`
* **Description:** Deletes a post.
    * **Owner:** Can delete their own post.
    * **Admin:** Can delete ANY post (Moderation).
* **Headers:**
    * `Authorization`: `Bearer <token>`
* **Path Parameters:**
    * `postId`: ID of the post to delete.
* **Response (200 OK):**
    ```text
    Post deleted successfully.
    ```

```text
Add Note: "If deleted by Admin, an alert email is sent to the content owner."
````
---
### 5. Delete a Comment
* **Endpoint:** `/api/forum/posts/{postId}/comments/{commentId}`
* **Method:** `DELETE`
* **Description:** Deletes a specific comment.
    * **Owner:** Can delete their own comment.
    * **Admin:** Can delete ANY comment.
* **Headers:**
    * `Authorization`: `Bearer <token>`
* **Path Parameters:**
    * `postId`: ID of the post.
    * `commentId`: ID of the comment.
* **Response (200 OK):**
    ```text
    Comment deleted successfully.
    ```

```text
Add Note: "If deleted by Admin, an alert email is sent to the content owner."
````

<hr>
<hr>
<hr>

### 👤 User Profile & Dashboard

### 1. Get My Profile
Fetch current logged-in user's details.
* **URL:** `/api/users/profile`
* **Method:** `GET`
* **Auth:** Yes

<hr>

### 2. Update Profile
Update name or university.
* **URL:** `/api/users/profile`
* **Method:** `PUT`
* **Auth:** Yes
* **Body:**
```json
{
  "name": "New Name",
  "university": "New University"
}
```
<hr>

### 3. Get My Uploads
Fetch all materials uploaded by the user with their status (PENDING/APPROVED).
* **Endpoint:** `/api/users/uploads`
* **Method:** `GET`
* **Auth:** `Yes`

<hr>

### 4. My Download History
Fetch the list of materials downloaded by the user.
* **Endpoint:** `/api/users/activity/downloads`
* **Method:** `GET`
* **Auth:** Yes
* **Response:** List of Downloaded items

<hr>

### 5. My Posts History
Fetch all discussion posts created by the user.
* **Endpoint:** `/api/users/activity/posts`
* **Method:** `GET`
* **Auth:** Yes
* **Response:** List of `My Posts`

<hr>

### 6. My Comments History
Fetch all comments made by the user on various posts.
* **Endpoint:** `/api/users/activity/comments`
* **Method:** `GET`
* **Auth:** Yes
* **Response:** List of `Comments`
---
### 4. Upload Profile Picture
* **Endpoint:** `/api/users/profile-pic`
* **Method:** `POST`
* **Description:** Updates the user's profile picture. Supports image files (JPG, PNG, etc.).
* **Headers:**
  * `Authorization`: `Bearer <token>`
  * `Content-Type`: `multipart/form-data`
* **Form Data (Body):**
  * `file`: The image file to upload.
* **Response (200 OK):**
  ```text
    Profile picture updated successfully! URL: [https://res.cloudinary.com/](https://res.cloudinary.com/)...
  ```

<hr>
<hr>
<hr>

## ADMIN MODULE

### 1. Get Dashboard Statistics
* **Endpoint:** `/api/admin/stats`
* **Method:** `GET`
* **Description:** Retrieves total counts of users, materials, pending requests, and forum posts for the admin dashboard.
* **Headers:**
  * `Authorization`: `Bearer <admin_token>`
* **Response (200 OK):**
    ```json
    {
      "totalUsers": 120,
      "totalMaterials": 45,
      "pendingMaterials": 5,
      "totalPosts": 30
    }
    ```
<hr>

### 2. Get All Users List
* **Endpoint:** `/api/admin/users`
* **Method:** `GET`
* **Description:** Retrieves a list of all registered users with their roles and block status.
* **Headers:**
  * `Authorization`: `Bearer <admin_token>`
* **Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "name": "Rocky Bhai",
        "email": "rocky@example.com",
        "role": "STUDENT",
        "isBlocked": true,
        "createdAt": "2025-01-01T10:00:00"
      },
      {
        "id": 2,
        "name": "Saurabh Admin",
        "email": "admin@example.com",
        "role": "ADMIN",
        "isBlocked": false,
        "createdAt": "2025-01-01T12:00:00"
      }
    ]
    ```

### 3. Block / Unblock User
* **Endpoint:** `/api/admin/users/{userId}/toggle-block`
* **Method:** `PUT`
* **Description:** Toggles the block status of a user. If blocked, they cannot login. If active, they get blocked.
* **Headers:**
  * `Authorization`: `Bearer <admin_token>`
* **Path Parameters:**
  * `userId`: ID of the user to block/unblock.
* **Response (200 OK):**
    ```text
    User block status updated successfully.
    ```
```text
Add Note: "Triggers an email notification to the user informing them about the account status change."
```
---

### 4. Create New Admin
* **Endpoint:** `/api/admin/create-admin`
* **Method:** `POST`
* **Description:** Creates a new user with **ADMIN** role. Only existing Admins can perform this action.
* **Headers:**
  * `Authorization`: `Bearer <admin_token>`
* **Request Body (JSON):**
    ```json
    {
      "name": "New Admin Name",
      "email": "newadmin@example.com",
      "password": "securepassword"
    }
    ```
* **Response (201 Created):**
    ```text
    New Admin registered successfully!
    ```
---
### 5. Get Top Contributors
* **Endpoint:** `/api/admin/stats/top-contributors`
* **Method:** `GET`
* **Description:** Returns a list of users who have uploaded the most study materials, sorted by upload count.
* **Headers:**
  * `Authorization`: `Bearer <admin_token>`
* **Response (200 OK):**
    ```json
    [
      {
        "name": "Rocky Bhai",
        "uploadCount": 15
      },
      {
        "name": "Saurabh Pandey",
        "uploadCount": 8
      }
    ]
    ```
---

### 6. Get Trending Materials
* **Endpoint:** `/api/admin/stats/trending-materials`
* **Method:** `GET`
* **Description:** Returns top 5 study materials based on the number of downloads.
* **Headers:**
  * `Authorization`: `Bearer <admin_token>`
* **Response (200 OK):**
    ```json
    [
      {
        "title": "Java Complete Notes",
        "subject": "Java Programming",
        "downloadCount": 150,
        "uploadedBy": "Rocky Bhai"
      },
      {
        "title": "Data Structure PYQs",
        "subject": "DSA",
        "downloadCount": 89,
        "uploadedBy": "Amit Kumar"
      }
    ]
    ```

<hr>
<hr>
<hr>
<hr>

# 📨 SUPPORT & FEEDBACK MODULE

### 1. Create a Support Ticket
Allows a logged-in user (Student) to submit a new query or complaint to the administration. The ticket is created with a default status of `OPEN`.

* **Endpoint:** `/api/support`
* **Method:** `POST`
* **Access:** `ROLE_STUDENT`, `ROLE_ADMIN`
* **Headers:**
  * `Authorization`: `Bearer <token>`
  * `Content-Type`: `application/json`

**Request Body:**
```json
{
  "subject": "Download Error",
  "message": "I am unable to download the notes for Java Unit 3. It gives a 404 error."
}
```
Success Response (200 OK):

```JSON
{
  "id": 1,
  "userName": "Rocky Bhai",
  "userEmail": "rocky@gmail.com",
  "subject": "Download Error",
  "message": "I am unable to download the notes for Java Unit 3. It gives a 404 error.",
  "adminReply": null,
  "status": "OPEN",
  "createdAt": "2025-01-02T10:00:00",
  "resolvedAt": null
}
```
---
### 2. Get My Ticket History
Fetches the list of all support tickets created by the currently logged-in user. Useful for checking the status of previous queries.
* **Endpoint:** `/api/support/my-tickets`
* **Method:** `GET`
* **Access:** `ROLE_STUDENT`

* **Headers:**
`Authorization`: `Bearer <token>`

Success Response (200 OK):

```JSON
[
  {
    "id": 1,
    "subject": "Download Error",
    "message": "...",
    "adminReply": null,
    "status": "OPEN",
    "createdAt": "2025-01-02T10:00:00"
  },
  {
    "id": 5,
    "subject": "Login Issue",
    "message": "...",
    "adminReply": "Password reset link sent.",
    "status": "RESOLVED",
    "createdAt": "2024-12-25T14:30:00"
  }
]
```
---
### 3. Get All Tickets (Admin Dashboard)
Allows the Administrator to view all support tickets raised by all users. The list is sorted by creation date (newest first).
* **Endpoint:** `/api/admin/support`
* **Method:** `GET`
* **Access:** `ROLE_ADMIN`
* **Headers:**
`Authorization`: `Bearer <token>`

Success Response (200 OK):

```JSON

[
  {
    "id": 2,
    "userName": "Amit Kumar",
    "userEmail": "amit@test.com",
    "subject": "Wrong Syllabus",
    "status": "OPEN",
    "createdAt": "2025-01-02T11:00:00"
  },
  {
    "id": 1,
    "userName": "Rocky Bhai",
    "userEmail": "rocky@gmail.com",
    "subject": "Download Error",
    "status": "OPEN",
    "createdAt": "2025-01-02T10:00:00"
  }
]
```
---
### 4. Resolve & Reply to Ticket
Allows the Administrator to reply to a specific ticket. System Action: This will update the status to RESOLVED, save the admin's reply, and automatically send an email notification to the student.

* **Endpoint:** `/api/admin/support/{id}/reply`
* **Method:** `PUT`
* **Access:** `ROLE_ADMIN`
* **Path Variable:**
`id: The ID of the support ticket (e.g., 1).`
* **Headers:**
`Authorization`: `Bearer <token>`
`Content-Type`: `application/json`

Request Body:

```JSON
{
  "replyMessage": "Hello, the issue has been fixed. Please try downloading the file again."
}
```
Success Response (200 OK):

```JSON
{
  "id": 1,
  "userName": "Rocky Bhai",
  "userEmail": "rocky@gmail.com",
  "subject": "Download Error",
  "message": "I am unable to download the notes...",
  "adminReply": "Hello, the issue has been fixed. Please try downloading the file again.",
  "status": "RESOLVED",
  "createdAt": "2025-01-02T10:00:00",
  "resolvedAt": "2025-01-02T12:05:00"
}
```
<hr>
<hr>
<hr>
<hr>

# 🔖 BOOKMARKS / SAVED ITEMS

### 1. Toggle Save Material
Adds a material to the user's saved list if not present, or removes it if already saved (Like/Unlike behavior).

* **Endpoint:** `/api/users/materials/{id}/save`
* **Method:** `POST`
* **Access:** `ROLE_STUDENT`
* **Path Variable:**
  * `id`: The ID of the material (e.g., `1`).
* **Headers:**
  * `Authorization`: `Bearer <token>`
* **Response (200 OK):**
    ```text
    Material saved/unsaved successfully.
    ```

---

### 2. Get Saved Materials
Retrieves the list of all study materials saved by the logged-in user.

* **Endpoint:** `/api/users/saved-materials`
* **Method:** `GET`
* **Access:** `ROLE_STUDENT`
* **Headers:**
  * `Authorization`: `Bearer <token>`

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Java Basics - Chapter 1",
    "description": "Introduction to Java syntax and loops.",
    "subject": "Java Programming",
    "fileUrl": "[https://res.cloudinary.com/demo/image/upload/sample.pdf](https://res.cloudinary.com/demo/image/upload/sample.pdf)",
    "uploadDate": "2025-12-29T19:29:28",
    "uploadedBy": "Saurabh Pandey"
  },
  {
    "id": 5,
    "title": "Data Structures Notes",
    "description": "Linked List and Arrays",
    "subject": "DSA",
    "fileUrl": "[https://res.cloudinary.com/](https://res.cloudinary.com/)...",
    "uploadDate": "2025-12-30T10:00:00",
    "uploadedBy": "Amit Kumar"
  }
]
```
---

### 3. Toggle Save Post
Adds a forum post to the user's saved list if not present, or removes it if already saved.

* **Endpoint:** `/api/users/posts/{id}/save`

* **Method:** `POST`

* **Access:** `ROLE_STUDENT`

* **Path Variable:**

`id: The ID of the post (e.g., 10).`

* **Headers:**

  * **Authorization:** `Bearer <token>`
 
**Response (200 OK):**

```Plaintext
Post saved/unsaved successfully.
```

--- 
### 4. Get Saved Posts
Retrieves the list of all forum discussions/posts saved by the logged-in user.

* **Endpoint:** `/api/users/saved-posts`

* **Method:** `GET`

* **Access:** `ROLE_STUDENT`
* **Headers:**
  * **Authorization:** `Bearer <token>`

**Success Response (200 OK):**

```JSON
[
  {
    "id": 10,
    "title": "How to fix StackOverflow Error?",
    "content": "I am getting infinite recursion in my Java code...",
    "createdAt": "2025-12-31T14:30:00",
    "authorName": "Rocky Bhai"
  }
]
```

<hr>
<hr>
<hr>
<hr>