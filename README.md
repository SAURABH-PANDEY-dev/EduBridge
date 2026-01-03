# 🎓 EduBridge - Smart Campus Resource Platform

![Java](https://img.shields.io/badge/Backend-Spring%20Boot-green)

**EduBridge** is a comprehensive web platform designed to bridge the gap between students and academic resources. It provides a centralized hub for sharing study materials, discussing doubts via forums, and managing student activities using a robust Role-Based Access Control (RBAC) system.

---

## 🏗️ Project Architecture

This project follows a **Monolithic / Multi-Module** structure:

* **📂 /backend**: Built with **Spring Boot 4.0.1 & Java 17**. Handles APIs, Security (JWT), Database interactions, and File Storage.
* **📂 /frontend**: Built with **React.js & Vite**. Provides the user interface for Students and Admins.

---

## 🚀 Key Features

* **🔐 Authentication:** Secure Login/Signup for Students and Admins (JWT).
* **📂 Material Hub:** Upload, Review (Admin), and Download Notes/PYQs.
* **💬 Community Forum:** Q&A discussions with upvote/downvote support.
* **📊 Analytics Dashboard:** Admin panel to view user stats and trending materials.
* **🎫 Support System:** Ticket-based help desk for students.

---

## 🛠️ Tech Stack

| Component | Technology Used                                    |
| :--- |:---------------------------------------------------|
| **Backend** | Java 17, Spring Boot 3, Spring Security, Hibernate |
| **Frontend** | React.js, Vite, Tailwind CSS (Planned)             |
| **Database** | postgres                                           |
| **File Storage** | Cloudinary                                         |
| **Tools** | IntelliJ IDEA, VS Code, Postman/Swagger            |

---

## 🏁 Getting Started

To set up the project locally, you need to run both the Backend and Frontend servers.

### 1️⃣ Backend Setup
Navigate to the `backend` folder to start the API server.
```bash
cd backend
# Refer to backend/README.md for detailed setup instructions
mvn spring-boot:run
```
---
# 🤝 Contribution
This project is being developed by:

* **Backend Lead:** <a href = "github.com/saurabh-pandey-dev"> <b><u> Saurabh Pandey </u></b> </a>

* **Frontend Lead:**<a href = "github.com/bleedingedge2004"> <b><u> Sachin Kumar Yadav </u></b> </a>

