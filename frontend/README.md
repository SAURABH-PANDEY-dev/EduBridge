# 🎨 EduBridge - Frontend Application

> User-Facing Web Interface for the EduBridge Platform.
> Built with React to provide a secure, role-based, and responsive learning experience for Students and Admins.

---

# 📖 Overview

The EduBridge Frontend is a Single Page Application (SPA) built using React and styled with Tailwind CSS. It consumes secure REST APIs exposed by the Spring Boot backend and enforces authentication, authorization, and role-based access control entirely on the client side.

The application is designed with modular components, protected routing, and centralized state management for authentication.

---

# 🧩 Key Features

## 🔐 Authentication & Security

User Registration & Login (JWT-based)

Persistent login using localStorage

Change Password & Forgot/Reset Password flows

Role-based route protection (STUDENT / ADMIN)

## 👤 User Dashboard

Sidebar navigation with responsive fallback (horizontal tabs)

My Profile (view/update profile & profile picture)

My Uploads (status: PENDING / APPROVED)

Download History

My Comment / Post History

Secure Logout

## 🧭 Routing & Access Control

ProtectedRoute for authenticated access

RoleProtectedRoute for admin-only features

Clean redirection on session expiry or logout

## 🎨 UI & Styling

Tailwind CSS utility-first styling

Responsive layouts (Desktop / Mobile)

Reusable components (Sidebar, Tabs, Forms)

---

# ⚙️ Tech Stack

Category | Technology
|
Framework | React 18
Build Tool | Vite
Styling | Tailwind CSS
Routing | React Router DOM
HTTP Client | Axios
Auth | JWT (Bearer Token)
State Mgmt | React Context API

---

# ⚙️ Setup & Installation

### 1. Prerequisites

Ensure the following are installed:

Node.js (v18+)

npm or yarn

### 2. Clone the Repository

git clone <frontend-repo-url>
cd frontend

### 3. Install Dependencies

npm install

### 4. Environment Configuration

Create a .env file in the project root:

VITE_API_BASE_URL=http://localhost:8080

> This should match the backend base URL.

### 5. Run the Application

npm run dev

The application will start at: 👉 http://localhost:5173

---

# 🔗 API Integration

All API calls are centralized using Axios with an interceptor for JWT handling.

Authorization: Bearer <JWT_TOKEN>

Handled automatically once the user logs in.

---

# 📂 Project Structure

src/
├── api/ # Axios instance & API functions
├── auth/ # AuthContext & security logic
├── components/ # Reusable UI components
├── pages/ # Route-based pages (Dashboard, Profile, etc.)
│ └── dashboard/ # User dashboard sections
├── routes/ # Protected & role-based routes
├── styles/ # Global styles (Tailwind)
├── App.js # App entry
└── main.jsx # React bootstrap

---

# 🧪 Testing Checklist

Login / Logout flow

Role-based route blocking

Profile update & image upload

Dashboard navigation (Sidebar + Tabs)

API error handling (401 / 403)

---

# 🤝 Contribution

## Frontend Lead:

<a href="https://github.com/BleedingEdge2004"><b><u>Sachin Kumar Yadav</u></b></a>

---

# 🚀 Status

Frontend is actively aligned with backend APIs and ready for feature expansion (Study Materials, Forum, Admin Dashboard).
