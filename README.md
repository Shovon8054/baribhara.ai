# 🏠 BariBhara.AI — AI-Powered Rental & Property Management SaaS

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

---

## 📌 Overview

**BariBhara.AI** is a modern, full-stack **AI-Powered Rental & Property Management SaaS platform**. Engineered with a clean **feature-based architecture**, it leverages **Google Gemini AI** for intelligent conversational property search and automated listing generation, backed by high-performance **Raw PostgreSQL queries (Zero ORM overhead)** and **Real-Time WebSockets (Socket.IO)**.

---

## ⭐ Key Highlights & Featured Capabilities

### 🤖 1. AI Natural Language Property Search
Say goodbye to complex filter forms. Tenants can express what they are looking for in natural, everyday language:
> *"Need a 3-bedroom family apartment under 25k in Dhanmondi."*

- **Gemini AI Query Intelligence:** Extracts budget constraints, desired locations, bedroom/bathroom counts, tenant suitability and required amenities in real-time.
- **Raw SQL Conversion:** Seamlessly translates structured AI outputs into optimized, paramaterized PostgreSQL queries with a resilient regex fallback engine.

---

### ⚡ 2. Real-Time Chat & Messaging (Socket.IO)
Direct, friction-free communication between property owners and prospective tenants:
- **Instant Messaging:** Low-latency WebSocket bidirectional communication.
- **Live User Status:** Real-time online/offline presence indicators.
- **Typing Indicators:** Real-time visual feedback when a conversation partner is typing.
- **Read Receipts:** Track message delivery and read confirmations.

---

### ✍️ 3. AI Listing Assistant for Property Owners
Allows landlords and property owners to publish high-converting listings in seconds:
- **Automated Copywriting:** Generates rich, professional property descriptions and catchy titles based on basic specs.
- **Listing Optimization:** Identifies missing details and suggests high-impact improvements to boost conversion.

---

### 📊 4. Favorites & AI Property Comparison
Intelligent decision-making engine for prospective tenants:
- **Wishlist Management:** One-tap favorite bookmarking.
- **AI Comparative Evaluation:** Select multiple saved properties and let Gemini AI analyze price-to-area ratios, amenity density, location advantages, and recommend the best value-for-money option.

---

## 🚀 Complete Feature Matrix

### 🔐 1. Authentication & Role-Based Access Control (RBAC)
- **JWT & Refresh Tokens:** Secure authentication with HTTP-only tokens.
- **Email Verification & Password Reset:** Complete email-based account verification and password recovery workflows.
- **Multi-Role System:** Granular access boundaries for `TENANT`, `OWNER`, and `ADMIN`.

---

### 🏢 2. Property Listing Management
- Multi-image upload handling (with server-side Multer image validation & max file limit caps).
- Detailed metadata: Price, Area (sqft), Bedrooms, Bathrooms, Property Type (Apartment, House, Flat, Studio, Penthouse, Duplex).
- Amenities & Nearby Facilities tracking (Schools, Hospitals, Supermarkets, Parks).
- Availability toggle & dynamic status tracking.

---

### 🔍 3. Multi-Criteria Advanced Search & Filter
- Multi-dimensional filtering by budget range, location search, room counts, and property categories.
- Dynamic sorting by price (Ascending/Descending), date listed, and popularity metrics.

---

### 💳 4. SaaS Subscription & Tiered Billing
- **Free Tier:** Access core browsing, basic search, and listing creation.
- **Premium Tier:** Unlocks unlimited AI Natural Language Search, AI Comparison Insights, and Real-Time Owner Chat.

---

### 🛠️ 5. Admin Dashboard & Platform Controls
- **User Management:** View, filter, verify, or suspend platform accounts.
- **Property Moderation:** Full oversight to review and delete invalid property listings.
- **Subscription Oversight:** Monitor billing plans and active premium subscriptions.

---

## 🏗️ Architecture & Tech Stack

### 🎨 Frontend
- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Vanilla CSS (Glassmorphism & Modern Dark UI Design Token System)
- **Icons:** Heroicons / Lucide React
- **Real-Time Client:** `socket.io-client`
- **HTTP Client:** Axios with dynamic base URL resolution

---

### ⚙️ Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Language:** TypeScript
- **Database Engine:** PostgreSQL via `pg` pool (**Raw SQL queries — No Prisma / No ORM overhead**)
- **AI Integration:** Google Gemini SDK (`@google/genai` & `@google/generative-ai`)
- **Real-Time Engine:** Socket.IO
- **Security:** Helmet, CORS, Bcrypt Password Hashing, JWT

---

## 📁 Project Structure (Feature-Based)

```
baribhara.ai/
├── backend/
│   ├── src/
│   │   ├── admin/               # Admin dashboard & management routes
│   │   ├── ai/                  # Gemini AI Search & Assistant integration
│   │   ├── auth/                # Auth, JWT, Signup, Verification
│   │   ├── chat/                # Real-time chat & Socket.IO handlers
│   │   ├── db/                  # Raw SQL schema (db.sql) & Pool config
│   │   ├── property-listing/    # Property CRUD, upload handlers & filters
│   │   ├── subscription/        # SaaS subscription logic
│   │   ├── app.ts               # Express configuration & CORS setup
│   │   └── index.ts             # Server entrypoint & DB auto-seeding
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                 # Axios instance & environment config
│   │   ├── components/          # Reusable UI components & AI search bar
│   │   ├── pages/               # Feature pages (Auth, Listings, Chat, Profile)
│   │   ├── services/            # API Service layer
│   │   ├── utils/               # Dynamic imageUrl & environment resolution
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## ⚡ Local Development Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Shovon8054/baribhara.ai.git
cd baribhara.ai
```

---

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the root directory (refer to `.env.example`):
```env
PORT=8081
HOST=0.0.0.0
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=baribhara
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_google_gemini_api_key
```

Import Database Schema into PostgreSQL:
```bash
psql -U postgres -d baribhara -f src/db/db.sql
```

Run Backend in Development Mode:
```bash
npm run dev
```

---

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
```

Create `.env` inside `frontend/`:
```env
VITE_API_URL=http://localhost:8081/api
```

Start Vite Development Server:
```bash
npm run dev
```

---

## 🌐 Live Deployments

- 🌐 **Frontend (Vercel):** [https://baribhara-ai-frontend.vercel.app](https://baribhara-ai-frontend.vercel.app)
- ⚙️ **Backend API (Render):** [https://baribhara-ai.onrender.com](https://baribhara-ai.onrender.com)
- 🗄️ **Database (Supabase):** PostgreSQL Engine

---

## 🔑 Default Seed Credentials

For quick platform testing:

| Role | Email | Password |
|---|---|---|
| 👑 Admin | `admin@baribhara.ai` | `Admin1234` |


---

⭐ **If you find this project helpful, give it a star on GitHub!**
