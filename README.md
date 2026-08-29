# CampusMind RAG - Intelligent College Chatbot & Ingestion Platform

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-success?style=flat-square&logo=vercel)](https://rag-college-chatbot.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-blue?style=flat-square&logo=render)](https://rag-college-chatbot.onrender.com/api/health)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An enterprise-grade, Retrieval-Augmented Generation (RAG) academic assistant and document ingestion platform engineered for **Apex Institute of Technology & Science (AITS)**.

---

## 1. Project Name
**CampusMind RAG** - College Chatbot & Vector Knowledge Management Platform

---

## 2. Problem Statement
Navigating complex academic regulations, admission deadlines, fee structures, hostel policies, and course syllabi often involves reading hundreds of pages across disparate PDFs and web portals. Students and applicants waste valuable time attempting to retrieve specific policy answers.

**CampusMind RAG** resolves this problem by grounding AI conversational responses directly in verified college documents using vector search retrieval. Answers feature strict inline source citations (`[Source 1: Official Admissions Guide]`), confidence relevance scoring, administrative knowledge ingestion tools, and interactive academic course exploration.

---

## 3. Features
- **Retrieval-Augmented Generation (RAG) Engine**: Sliding-window document chunking, TF-IDF / Cosine similarity vector search, and contextual answer synthesis.
- **Source Citation Transparency**: Every assistant answer contains clickable citations displaying exact document titles, department origin, matching vector chunk snippets, and relevance scores.
- **Domain Category Filtering**: Filter query contexts across Admissions, Academics, Financials, Campus Life, Placements, and FAQs.
- **Admin Knowledge Hub (CRUD)**: Upload and ingest new policy documents, view indexed vector chunks, and remove outdated materials in real-time.
- **Course & Academic Directory**: Searchable catalog of degree programs (B.Tech CS, B.Tech AI & DS, M.Tech Cybersecurity, Ph.D. Robotics) with fee schedules and department contact details.
- **Analytics & Health Dashboard**: Telemetry metrics tracking ingested document counts, indexed vector chunks, chunk length averages, and grounding health.
- **Authentication & Role Access**: JWT-based login/registration with student, faculty, and admin roles, including quick one-click demo login accounts.
- **Responsive Dynamic Interface**: Modern glassmorphism dark/light design system with custom micro-animations, skeleton loaders, and touch-friendly controls.

---

## 4. Technology Stack
- **Frontend**: React 18, Vite, Lucide Icons, Glassmorphism CSS Design System.
- **Backend API**: Node.js, Express.js, JWT Authentication, BcryptJS, Multer file upload engine.
- **RAG & Vector Retrieval**: Custom TF-IDF & Cosine Similarity vector indexing engine with sliding-window text chunking.
- **Database**: MongoDB Atlas Mongoose schema support with high-performance zero-config in-memory database fallback.
- **Deployment Stack**: Vercel (Frontend SPA) + Render (Backend API Service) + GitHub Repository.

---

## 5. Screenshots
```
+-----------------------------------------------------------------------------------+
|  [Logo] CampusMind RAG    [RAG Assistant] [Course Directory] [Knowledge Hub]      |
+-----------------------------------------------------------------------------------+
|  Filter Domain: [All]                                [Clear History]               |
|  Suggested: (Admissions) (Tuition Fees) (CS Curriculum) (Hostels) (Placements)    |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | [Bot] AITS Assistant (RAG Grounded)                     [98% Confidence]   |  |
|  | Based on the Official Admissions Guide 2026-2027:                          |  |
|  | • Deadlines: Early Decision is Nov 15, Regular Round 1 is Jan 31.           |  |
|  | • Eligibility: Minimum 60% in 10+2 with PCM. Accepted scores: SAT (1250+). |  |
|  |                                                                             |  |
|  | Grounded Sources: [SRC-1: Official Admissions Guide 2026]                    |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
|  [ Ask any question about AITS admissions, courses, fees, hostels... ] [ Send ]   |
+-----------------------------------------------------------------------------------+
```

---

## 6. Live Demo
- **Frontend App (Vercel)**: [https://rag-college-chatbot.vercel.app](https://rag-college-chatbot.vercel.app)

---

## 7. Backend
- **Backend API Base URL (Render)**: [https://rag-college-chatbot.onrender.com/api](https://rag-college-chatbot.onrender.com/api)
- **API Health Check**: `GET /api/health`
- **Key Endpoints**:
  - `POST /api/chat/query` - RAG vector retrieval & answer synthesis
  - `GET /api/chat/history` - Retrieve chat session history
  - `GET /api/knowledge` - List indexed documents
  - `POST /api/knowledge/upload` - Ingest new policy document
  - `GET /api/stats` - RAG engine performance metrics
  - `POST /api/auth/login` - User authentication

---

## 8. Setup Instructions

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables (or copy example)
cp .env.example .env

# Start development server
npm run dev
# Backend server will run on http://localhost:5000
```

### 2. Frontend Setup
```bash
# Open new terminal window and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start frontend development server
npm run dev
# Frontend app will open at http://localhost:3000
```

---

## 9. Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
MONGO_URI=mongodb+srv://user:password@cluster0.example.mongodb.net/rag_college_db
MAX_FILE_SIZE_MB=10
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> **Important**: Never commit actual API keys, database passwords, or secret keys to GitHub. Use environment variables.
