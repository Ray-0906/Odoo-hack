# 📘 StackIt - Developer Q&A Platform

---

## 👥 Team Details

**Team Name**: Bank Bros

**Team Members**:

| Name              | Email                        |
|-------------------|------------------------------|
| Asraful Hoque (TL)| asraful.bros@gmail.com       |
| Aniket Tripathi   | 2023ugec007@nitjsr.ac.in     |
| Arsh Khan         | 2023ugec007@nitjsr.ac.in     |

---

## 📖 Project Overview

**StackIt** is a full-stack developer-focused **Q&A platform** designed to simplify knowledge sharing, question answering, and community engagement among programmers, students, and tech enthusiasts.

Inspired by Stack Overflow, it includes:
- An intuitive frontend for browsing, filtering, and interacting with questions and answers.
- A powerful backend supporting real-time interaction, notifications, and role-based actions (like answer approval by question authors).
- A sleek, modern UI with dynamic routing, protected views, and cookie-based authentication.

---

## 🧠 Key Functionalities

- **Authentication**:
  - Email/password login with form validation using React Hook Form + Yup.
  - Secure cookie-based login using JWT.
  - Auth state persisted using `localStorage` and protected routes with `AuthCheck` wrapper.

- **Q&A Features**:
  - Users can ask questions with title, rich text description, and tags.
  - Others can answer, and question authors can approve one answer as "Accepted".
  - Like and upvote/downvote interactions.

- **Notifications System**:
  - Users receive alerts when:
    - Someone answers their question.
    - Their question is liked.
    - Their answer is upvoted.
  - Notifications are stored in MongoDB under a custom `NoticeBox` schema.
  - Unread indicators and filtering by type (like, vote, answer).

- **Rich UI**:
  - Built using React.js + Tailwind CSS for speed and responsiveness.
  - Interactive filters, tag-based search, pagination, and loading skeletons.
  - Login/Signup themes and navigation UI adapt to auth state.

---

## 🛠️ Technologies Used

### Frontend:
- React.js (with Vite)
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form + Yup
- LocalStorage

### Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- Cookie-based JWT Auth
- RESTful API design

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js
- MongoDB

### 1. Clone the Repo
```bash
git clone https://github.com/bankbros/Odoo-hack.git
cd Odoo-hack
