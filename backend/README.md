# 🛠️ EduBridge - Backend Service

> **Core API Service for the EduBridge Platform.**
> Handles authentication, material management, forum discussions, and admin controls.

![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green?logo=springboot)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?logo=postgresql)
![Security](https://img.shields.io/badge/Security-JWT-red)
[![wakatime](https://wakatime.com/badge/github/SAURABH-PANDEY-dev/EduBridge.svg)](https://wakatime.com/badge/github/SAURABH-PANDEY-dev/EduBridge)

---

## 📖 Overview

This backend is built using **Spring Boot** and follows a standard **MVC Architecture**. It exposes RESTful APIs consumed by the React Frontend. It handles secure file uploads via Cloudinary, email notifications via Gmail SMTP, and strictly enforces Role-Based Access Control (RBAC).

## 🧩 Key Modules & Features

Based on the implemented Controllers:

| Module | Controller | Description |
| :--- | :--- | :--- |
| **🔐 Auth** | `AuthController` | JWT Login, Registration, Password Encryption. |
| **👤 User** | `UserController` | Profile management, Password Reset, Saved Items, Activity History. |
| **📚 Materials** | `MaterialController` | Upload (PDF/Img), Search, Download, Admin Approval System. |
| **💬 Forum** | `ForumController` | Q&A Posts, Comments, Upvote/Downvote, "Accept Answer". |
| **🛠️ Admin** | `AdminController` | Dashboard Stats, Block/Unblock Users, Trending Content. |
| **🎫 Support** | `SupportController` | Ticket creation (Student) and Resolution (Admin). |

---

## ⚙️ Setup & Installation

### 1. Prerequisites
Ensure you have the following installed:
* **Java Development Kit (JDK) 21**
* **Maven**
* **PostgreSQL** (Running on port 5432)

### 2. Environment Configuration
Create a database named `edubridge_db` in PostgreSQL.

Open `src/main/resources/application.properties` and configure your keys.
*(Below is the template based on the project configuration)*:

```properties
# --- Database Configuration (PostgreSQL) ---
spring.datasource.url=jdbc:postgresql://localhost:5432/edubridge_db
spring.datasource.username=YOUR_DB_USERNAME  # e.g., postgres
spring.datasource.password=YOUR_DB_PASSWORD

# --- JWT Security ---
# Use a strong 256-bit Hex key
application.security.jwt.secret-key=YOUR_HEX_SECRET_KEY
application.security.jwt.expiration=86400000

# --- Email Service (Gmail SMTP) ---
spring.mail.username=YOUR_EMAIL@gmail.com
spring.mail.password=YOUR_APP_PASSWORD  # Not your login password, use App Password

# --- Cloudinary (File Storage) ---
cloudinary.cloud-name=YOUR_CLOUD_NAME
cloudinary.api-key=YOUR_API_KEY
cloudinary.api-secret=YOUR_API_SECRET