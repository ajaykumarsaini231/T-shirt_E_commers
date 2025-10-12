

# Dreamora Frontend – Next.js E-Commerce Platform

> **Live on [https://client-delta-brown.vercel.app/](https://client-delta-brown.vercel.app/)**
> 
> **Backend Live API on: [https://server-qfd2.onrender.com](https://server-qfd2.onrender.com)**
> 
> **Backend Repo: [https://github.com/ajaykumarsaini231/server](https://github.com/ajaykumarsaini231/server)**
> 
_Shop smarter, live better. Discover the future of online shopping with Dreamora._

--

<img width="2048" height="2048" alt="image" src="https://github.com/user-attachments/assets/faa6456f-a234-4e1b-938f-ca45e06e1416" />


---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Available Pages & Components](#available-pages--components)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Integration](#api-integration)
- [Screenshots](#screenshots)
- [License](#license)
- [Contributing](#contributing)

---

## Overview

Dreamora Frontend is a modular e-commerce web application built with Next.js, TypeScript, TailwindCSS, and Zustand. It features a full suite of e-commerce and admin dashboard functionalities, tightly integrated with a secure Express.js backend.

---

## Features

- Modular App Router in Next.js 13+ with File-based Routing
- JWT Authentication & Session Management
- Responsive design with TailwindCSS  
- Reusable UI components and strong input validation
- Dynamic State Management (Zustand)
- Admin Dashboard (manage products, categories, orders, users)
- Product Listing, Cart, Checkout, Wishlist
- User Profile & Order Tracking
- Signup/Login/OTP Email Verification
- Full integration with REST API backend

---

## Project Structure

```
src/
├─ about/               # About page
├─ cart/                # Cart, item management
├─ checkout/            # Checkout process, address, payments
├─ contact/             # Contact form & info
├─ context/             # Global providers/context
├─ dashboard/           # Admin dashboard, protected routing
│  ├─ admin/
│     ├─ categories/
│     ├─ orders/
│     ├─ products/
│     ├─ users/
│     ├─ page.tsx
│     ├─ layout.tsx
├─ login/               # Login and session
├─ otp/                 # OTP Login/Verification
├─ product/             # Single product, listings
├─ profile/             # User profile & settings
├─ shop/                # Main shop & browsing
├─ signup/              # User registration
├─ thankyou/            # Purchase/order completion
├─ wishlist/            # User wishlist
├─ layout.tsx           # Global app layout
├─ ...
```

---

## Available Pages & Components

- **Home** (`/`)  
  Main store landing page, featured products.
- **Shop** (`/shop`)  
  Browse all products, search, and filter.
- **About** (`/about`)  
  Info about Dreamora and the team.
- **Contact** (`/contact`)  
  Contact form with email/message submission.
- **Cart** (`/cart`)  
  Add, remove, and checkout products.
- **Checkout** (`/checkout`)  
  Address, payment info, order placement.
- **Profile** (`/profile`)  
  User details, order tracking, edit info.
- **Wishlist** (`/wishlist`)  
  View/manage user wishlist.
- **Login & Signup** (`/login`, `/signup`)  
  Auth, session, email/OTP verification.
- **OTP** (`/otp`)  
  Email-based OTP validation.
- **Dashboard** (`/dashboard/admin`)  
  Admin landing & overview (protected)  
  - **Categories:** Manage, add, edit, or remove.
  - **Orders:** View, update, process orders.
  - **Products:** List, create, or modify products.
  - **Users:** View/manage users.
- **Thank You** (`/thankyou`)  
  Post-purchase/registration page.
---

## Getting Started

### 1. Clone the Repository

```
git clone https://github.com/your-username/dreamora-frontend.git
cd dreamora-frontend
```

### 2. Install Dependencies

```
npm install
```

## Environment Variables

Create a `.env.local` file in your root folder:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3001
```

### 4. Run the Development Server

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

## Scripts

- `npm run dev`       – Start development server
- `npm run build`     – Build for production
- `npm start`         – Start production server
- `npm run lint`      – Run linter
- `npm run format`    – Format code

---

## API Integration

All data/fetch requests are served from your Express.js backend, configured via environment variables above.  
- **Authentication**: JWT/Session-based (handles login, register, sessions)
- **Products/Orders/Categories**: Fetched dynamically using REST APIs
- **Protected Routes**: Admin/dashboard pages are protected via auth/role middleware.

---

## Screenshots

<!-- Example usage—add your own screenshots under each bullet. -->
### Home Page
<img width="1365" height="637" alt="image" src="https://github.com/user-attachments/assets/bea60f66-8e22-45a1-84c8-285d6a5f8c07" />


### Shop Page
<img width="1365" height="636" alt="image" src="https://github.com/user-attachments/assets/c808ea4c-88ac-4199-bc7a-6f15f87f4e34" />


### Cart Page
<img width="1365" height="637" alt="image" src="https://github.com/user-attachments/assets/1f2eebdf-0e29-4fe0-8ace-df7b9087e9c8" />

### Profile Page 
  **User dashboard**
<img width="1351" height="634" alt="image" src="https://github.com/user-attachments/assets/c89c3c94-82d3-4634-9202-a1362e0fd48a" />
 **User ordered product** 
<img width="1355" height="631" alt="image" src="https://github.com/user-attachments/assets/379fe0bb-72d0-4129-9a26-747e2827ab08" />
  **User saved address** 
<img width="1355" height="635" alt="image" src="https://github.com/user-attachments/assets/5a253198-fd03-4e32-ac7c-002b6e086865" />

### Admin Dashboard
<img width="1365" height="635" alt="image" src="https://github.com/user-attachments/assets/87736d39-bf6e-4de3-a70b-c6734691a06f" />


<img width="1365" height="638" alt="image" src="https://github.com/user-attachments/assets/8b92e0a6-6b25-477b-ba7f-9a856396260e" />


<img width="1365" height="576" alt="image" src="https://github.com/user-attachments/assets/88f82455-1f61-4d67-8d07-a824c8c1e910" />

### ...images for each individual page (checkout, wishlist, login, product, signup, thankyou, etc.).

<img width="1358" height="636" alt="image" src="https://github.com/user-attachments/assets/df5dc66e-93c2-449e-9f5e-dc01fab2011d" />

<img width="1338" height="629" alt="image" src="https://github.com/user-attachments/assets/a818d3ac-9017-46c6-9349-d7cd3a4706a9" />
#### Login
<img width="1354" height="615" alt="image" src="https://github.com/user-attachments/assets/b2328b15-e1b0-4bb1-a6e4-2bd38baff039" />

<img width="1352" height="635" alt="image" src="https://github.com/user-attachments/assets/9b7fab28-4dca-4a81-b893-fac2194c423a" />

---

## License

MIT

---

## Contributing

Fork, make a feature branch, and submit a PR! Issues and suggestions are also welcome.

---

```
