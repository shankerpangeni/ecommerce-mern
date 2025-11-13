# 🛒 E-Commerce Platform

A full-stack e-commerce web application built using **Next.js**, **Node.js**, **Express**, **MongoDB**, and **Cloudinary**.  
The platform allows users to browse, manage, and purchase products securely while providing an admin dashboard to manage shops, products, and users.

---

## 🚀 Live Demo
👉 [Live Website](https://ecommerce-mern-seven-zeta.vercel.app/)

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Cloudinary Setup](#-cloudinary-setup)
- [API Routes](#-api-routes)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 👤 User
- User authentication using JWT (Login, Signup)
- Profile management with Cloudinary image upload
- Browse and filter products by category
- Add to cart and proceed to payment checkout

### 🛍️ Admin
- Admin dashboard for managing shops, users, and products
- Full CRUD operations for products and shops
- Role-based access (User/Admin)

### 💳 Payment Integration
- Integrated secure payment gateway for online transactions

### ☁️ Cloudinary Integration
- Image uploads dynamically stored in:
  - `ecommerce/profile-pic/{userId}`
  - `ecommerce/shops/{shopId}`
  - `ecommerce/products/{productId}`

---

## 🧠 Tech Stack

**Frontend:**  
- Next.js  
- React.js  
- Tailwind CSS  

**Backend:**  
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- Cloudinary (Media Storage)  
- Multer (File Uploads)

**Other Tools:**  
- JWT Authentication  
- Bcrypt Password Hashing  
- RESTful API Design  

---

## 📁 Project Structure

