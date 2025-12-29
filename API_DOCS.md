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