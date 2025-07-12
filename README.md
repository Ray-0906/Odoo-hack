# 📘 StackIt - Developer Q&A Platform

---

## 👥 Team Details

**Team Name**: Bank Bros

**Team Members**:

| Name                | Email                        |
|---------------------|------------------------------|
| Asraful Hoque (TL)  | asraful.bros@gmail.com       |
| Aniket Tripathi     | 2023ugec007@nitjsr.ac.in     |
| Arsh Khan           | 2023ugec007@nitjsr.ac.in     |

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
  - Auth state persisted using `localStorage` and protected routes with an `AuthCheck` wrapper.

- **Q&A Features**:
  - Users can ask questions with title, rich text description, and tags.
  - Others can answer, and question authors can approve one answer as "Accepted".
  - Like and upvote/downvote functionality.

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
  - Login/Signup themes and navigation UI adapt based on auth state.

---

## 🛠️ Technologies Used

### Frontend:
- React.js (Vite)
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form + Yup
- LocalStorage

### Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (with cookie-based authentication)
- RESTful APIs

---

## 🚀 Running the Project Locally

### Prerequisites:
- Node.js
- MongoDB

---

### 1. Clone the Repo

```bash
git clone https://github.com/bankbros/Odoo-hack.git
cd Odoo-hack
```

---

### 2. Backend Setup

```bash
cd server
npm install
npm start
```

#### Create a `.env` file inside `server/`:

```env
MONGO_URI=mongodb://localhost:27017/stackit
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

---

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

#### Create a `.env` file inside `client/`:

```env
VITE_SERVER_URL=http://localhost:3000
```

---

## 📬 Contact

Have suggestions or want to contribute?

📧 **asraful.bros@gmail.com**

---

## 📄 License

This project is licensed under the **MIT License**.

---

> Made with 💙 by **Bank Bros**
