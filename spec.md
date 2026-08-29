# RAG College Chatbot - Specification

## Project Requirements
Every submitted project should contain the following wherever applicable:

### Frontend
- Responsive user interface
- Navigation (Navbar, Sidebar/Tabs, Footer)
- Forms (Login, Signup, Knowledge Base Ingestion/Feedback, Search)
- Appropriate loading states & skeletons
- Error handling & toast notifications
- User-friendly modern dynamic design

### Backend
- API endpoints (Auth, Chat Query, Knowledge Base CRUD, Analytics)
- Business logic & RAG vector search pipeline (Chunking, Embedding, Similarity Matching, Context Synthesis)
- Input validation & sanitation
- Error handling middleware
- Proper environment-variable configuration (`.env.example`)

### Database
- Proper database structure (Users, Documents/Chunks, Chat History, FAQs)
- CRUD operations
- Data validation
- Appropriate relationships (User <-> Conversations, Document <-> Chunks)

### Authentication
- Login / Signup / Logout
- Protected pages & API routes (User & Admin access control)
- JWT token / session handling

---

## 8. Deployment Requirements
- Recommended Architecture: GitHub -> Vercel (Frontend) & Render (Backend) -> MongoDB Atlas / Supabase
- Platform Mapping:
  - Source Code: GitHub
  - Frontend: Vercel
  - Backend: Render
  - Database: MongoDB Atlas / Supabase

---

## 9. GitHub Repository Requirements
```
project/
├── frontend/
├── backend/
├── README.md
└── .gitignore
```
- No sensitive keys, database passwords, `.env` files committed.

---

## 10. README Requirements
1. Project Name
2. Problem Statement
3. Features
4. Technology Stack
5. Screenshots
6. Live Demo
7. Backend API Info
8. Setup Instructions
9. Environment Variables
