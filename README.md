# Music Catalog Insights Platform

A full-stack, enterprise-grade application for music catalog discovery, personal library management, analytics, and AI-powered trend summaries built with **Java 21, Spring Boot 3, PostgreSQL, React (Vite + TypeScript), Tailwind CSS, and Recharts**.

## 🏗️ Architecture & Stack

- **Backend**: Java 21, Spring Boot 3.3+, Spring Security (Stateless JWT), Spring Data JPA, Spring Web / RestClient
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React Icons, Recharts
- **Database**: PostgreSQL 16
- **External Integration**: iTunes Search API (`https://itunes.apple.com/search`)
- **AI Engine**: Integrated LLM Trend Summary Engine (OpenAI / Groq API with robust fallback)
- **Deployment Ready**: Render (Backend + PostgreSQL DB) & Vercel (Frontend)

---

## 📁 Repository Structure

```
music-catalog-insights/
├── backend/            # Spring Boot 3 Java 21 REST API
├── frontend/           # React + TypeScript + Vite Single Page Application
├── docker-compose.yml  # Local multi-container development environment
└── README.md           # Project Documentation
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **JDK 21** or higher
- **Node.js 18+** & `npm`
- **Docker & Docker Compose** (Optional, for local PostgreSQL)

### 1. Database Setup (Docker)
Start PostgreSQL in detached mode:
```bash
docker-compose up -d postgres
```

### 2. Backend Setup (Spring Boot)
Navigate to `/backend`:
```bash
cd backend
# Create local environment configuration if needed
cp .env.example .env

# Run using Maven wrapper
./mvnw spring-boot:run
```
The API server will start at `http://localhost:8080`.

### 3. Frontend Setup (React + Vite)
Navigate to `/frontend`:
```bash
cd frontend
npm install
npm run dev
```
The UI will start at `http://localhost:5173`.

---

## 🔗 REST API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | ❌ No |
| `POST` | `/api/auth/login` | Authenticate & issue JWT | ❌ No |
| `GET` | `/api/search` | Search albums via iTunes API | 🔒 Yes |
| `GET` | `/api/library` | List authenticated user's saved albums | 🔒 Yes |
| `GET` | `/api/library/{id}` | Get specific saved album details | 🔒 Yes |
| `POST` | `/api/library` | Save album to personal library | 🔒 Yes |
| `PUT` | `/api/library/{id}` | Update rating (1-5) or personal notes | 🔒 Yes |
| `DELETE` | `/api/library/{id}` | Remove album from library | 🔒 Yes |
| `GET` | `/api/analytics` | Fetch aggregation stats on local saved library | 🔒 Yes |
| `POST` | `/api/insights/trend-summary` | Generate AI trend summary report | 🔒 Yes |

---

## 🛡️ License
MIT License. Created as a take-home architecture solution.
