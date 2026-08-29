# CampusMind RAG - Intelligent College Chatbot & Ingestion Platform

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-success?style=flat-square&logo=vercel)](https://rag-college-chatbot.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-blue?style=flat-square&logo=render)](https://rag-college-chatbot.onrender.com/api/health)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An enterprise-grade, Retrieval-Augmented Generation (RAG) academic assistant and document ingestion platform engineered for **Apex Institute of Technology & Science (AITS), Bengaluru**.

---

## 1. Project Name
**CampusMind RAG** - College Chatbot & Vector Knowledge Management Platform

---

## 2. Problem Statement
Navigating complex academic regulations, admission deadlines, fee structures, hostel policies, and course syllabi often involves reading hundreds of pages across disparate PDFs and web portals. Students and applicants waste valuable time attempting to retrieve specific policy answers.

**CampusMind RAG** resolves this problem by grounding AI conversational responses directly in verified college documents using vector search retrieval. Answers feature strict inline source citations (`[SRC-1: Official Admissions Guide]`), confidence relevance scoring, administrative knowledge ingestion tools, and interactive academic course exploration.

---

## 3. Features & Sample Query Data

### Key Features
- **Retrieval-Augmented Generation (RAG) Engine**: Sliding-window document chunking, TF-IDF / Cosine similarity vector search, and contextual answer synthesis.
- **Source Citation Transparency**: Every assistant answer contains clickable citations displaying exact document titles, department origin, matching vector chunk snippets, and relevance scores.
- **Domain Category Filtering**: Filter query contexts across Admissions, Academics, Financials, Campus Life, Placements, and FAQs.
- **Admin Knowledge Hub (CRUD)**: Upload and ingest new policy documents, view indexed vector chunks, and remove outdated materials in real-time.
- **Course & Academic Directory**: Searchable catalog of degree programs (B.Tech CS, B.Tech AI & DS, M.Tech Cybersecurity, Ph.D. Robotics) formatted in Indian Rupees (₹) with fee schedules and department contact details.
- **Analytics & Health Dashboard**: Telemetry metrics tracking ingested document counts, indexed vector chunks, chunk length averages, and grounding health.
- **Centered Modern Auth Interface**: JWT-based login/registration with student, faculty, and admin roles.

### Sample Test Queries & Verified Data
| Category | Sample Question | Grounded Answer Data |
| :--- | :--- | :--- |
| **Admissions** | *"What are the admission deadlines & JEE ranks for 2026?"* | • Phase 1 Nov 15, Phase 2 Jan 31, Final Counseling April 15.<br>• Min 60% in 10+2 (PCM) (55% for SC/ST/OBC).<br>• JEE Main (> 85 Percentile) or AITS-NET Rank < 5000.<br>• Form Fee: ₹ 1,000 (Waiver for SC/ST & EWS). |
| **Tuition Fees** | *"What are the B.Tech tuition fees and scholarships?"* | • B.Tech Tuition: **₹ 1,25,000 / semester** (₹ 2,50,000/year).<br>• M.Tech Tuition: **₹ 95,000 / semester**.<br>• Founder Merit: 100% waiver for JEE Main < 2000.<br>• EWS Aid: Up to 70% support (family income < ₹ 3.5 LPA). |
| **Hostels & Mess** | *"What are the hostel charges and mess menu?"* | • Ramanujan Hall (Boys): Twin AC (₹ 65,000/sem) \| Non-AC (₹ 42,000/sem).<br>• Kalpana Chawla Hall (Girls): Twin AC (₹ 65,000/sem) \| Deluxe (₹ 90,000/sem).<br>• Mess Fee: ₹ 36,000/semester (Veg, Non-Veg, Jain menu). |
| **Placements** | *"What is the highest and average LPA placement package?"* | • Highest Domestic: **₹ 54 LPA**.<br>• Highest International: **₹ 1.25 Crore per annum**.<br>• Average CS/AI Package: **₹ 14.5 LPA** (Median ₹ 9.8 LPA).<br>• Top Recruiters: TCS, Infosys, Google India, Microsoft, Amazon, Nvidia, Deloitte. |
| **Campus Info** | *"What is the campus address and library timings?"* | • Address: Electronic City Phase 1, Hosur Main Road, Bengaluru, Karnataka - **560100**.<br>• Library Timings: 8:00 AM to 10:00 PM (24/7 during exams).<br>• Bus Fee: ₹ 18,000 / semester. |

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
|  Suggested: (Admissions & JEE Ranks) (Tuition Fees ₹) (CS Curriculum) (Hostels)  |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | [Bot] AITS Assistant (RAG Grounded)                     [98% Confidence]   |  |
|  | Based on the Official Admissions Guide 2026-2027:                          |  |
|  | • Deadlines: Phase 1 Nov 15, Phase 2 Jan 31.                               |  |
|  | • Eligibility: Minimum 60% in 10+2 (PCM). Accepted: JEE Main (>85 percentile).|  |
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
# Backend server will run on http://localhost:5001
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
PORT=5001
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
MONGO_URI=mongodb+srv://user:password@cluster0.example.mongodb.net/rag_college_db
MAX_FILE_SIZE_MB=10
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5001/api
```

> **Important**: Never commit actual API keys, database passwords, or secret keys to GitHub. Use environment variables.
