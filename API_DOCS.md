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
<hr>

### Delete Material
Permanently removes a material from the database and deletes the associated file from Cloudinary.
- **Endpoint:** `/api/materials/{id}`
- **Method:** `DELETE`
- **Auth Required:** Yes (ROLE_ADMIN)
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `"Material and associated file deleted successfully."`
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

<hr>

### 4. Get Post Comments
* **Endpoint:** `/api/forum/posts/{postId}/comments`
* **Method:** `GET`
* **Auth Required:** Yes

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

<hr>
<hr>
<hr>

