# 🔲 QR Code Generator — Full Stack Web App

![Node.js](https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React.js-Frontend-blue?style=for-the-badge&logo=react)
![Express](https://img.shields.io/badge/Express.js-Framework-lightgrey?style=for-the-badge&logo=express)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange?style=for-the-badge&logo=jsonwebtokens)
![Status](https://img.shields.io/badge/Status-Complete-brightgreen?style=for-the-badge)

---

## 📌 Project Overview

A **full-stack web application** that allows authenticated users to generate QR codes instantly from any URL or text input. Built with a **React.js frontend** and **Node.js + Express.js backend**, connected via RESTful APIs with secure user authentication.

> 💡 This project demonstrates full-stack development skills — from UI design to API integration to secure backend logic.

---

## ⚙️ Tech Stack

| Technology | Purpose |
|---|---|
| **React.js** | Frontend UI and user interactions |
| **Node.js** | Backend server runtime |
| **Express.js** | API routing and middleware |
| **JWT** | Secure user authentication |
| **RESTful API** | Frontend-backend communication |
| **QR Code Library** | QR code generation logic |

---

## ✨ Features

- 🔐 **User Authentication** — Register and login with JWT protected sessions
- ⚡ **Instant QR Generation** — Generate QR codes from any URL or text in real time
- 📥 **Download QR Code** — Save generated QR codes as PNG images
- 🎨 **Clean UI** — Simple and responsive React frontend
- 🔒 **Protected Routes** — Only authenticated users can generate QR codes
- 📡 **RESTful API** — Modular backend with clean separation of concerns

---

## 🏗️ Project Structure

```
├── client/                  # React.js Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── QRGenerator.jsx
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
│
├── server/                  # Node.js Backend
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── qrRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── qrController.js
│   └── server.js
└── package.json
```

---

## 🔗 API Endpoints

### 👤 Auth Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |

### 🔲 QR Code Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/qr/generate` | Generate QR code (Protected) |

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js installed
- npm or yarn

### Step 1 — Clone the repo
```bash
git clone https://github.com/prashikBesekar/qr-code-generator
cd qr-code-generator
```

### Step 2 — Install backend dependencies
```bash
cd server
npm install
```

### Step 3 — Install frontend dependencies
```bash
cd client
npm install
```

### Step 4 — Create .env file in server folder
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

### Step 5 — Run backend
```bash
cd server
npm start
# Backend running on http://localhost:5000
```

### Step 6 — Run frontend
```bash
cd client
npm start
# Frontend running on http://localhost:3000
```

### Step 7 — Use the app
- Register a new account
- Login to get your JWT session
- Enter any URL or text
- Click Generate and download your QR code!

---

## 📸 Key Learnings

- Building a **full-stack application** with React and Node.js
- Connecting frontend and backend via **RESTful APIs**
- Implementing **JWT authentication** across full stack
- **Modular architecture** for scalable and maintainable code
- Managing **React state** for real-time UI updates
- Handling **file generation and download** on the frontend

---

## 🔗 Connect With Me

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Prashik_Besekar-blue?style=flat&logo=linkedin)](https://linkedin.com/in/prashik-besekar)
[![GitHub](https://img.shields.io/badge/GitHub-prashikBesekar-black?style=flat&logo=github)](https://github.com/prashikBesekar)

---

⭐ **If this project helped you, please give it a star!**
