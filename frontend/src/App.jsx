import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ChatInterface from './components/ChatInterface';
import KnowledgeHub from './components/KnowledgeHub';
import CourseDirectory from './components/CourseDirectory';
import AnalyticsView from './components/AnalyticsView';
import AuthModal from './components/AuthModal';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const API_BASE = '/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error' | 'info', message: string }

  const showToast = (message, type = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const [chatHistory, setChatHistory] = useState([
    {
      id: "msg-welcome",
      sender: "bot",
      text: "Hello! Welcome to Apex Institute of Technology & Science (AITS) Assistant. How can I help you today with admissions, courses, fees, or hostel facilities?",
      timestamp: new Date().toISOString(),
      citations: [],
      confidenceScore: 1.0
    }
  ]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const [documents, setDocuments] = useState([]);
  const [chunks, setChunks] = useState([]);
  const [stats, setStats] = useState(null);

  // Check Backend Health & Token on Mount
  useEffect(() => {
    fetchHealth();
    fetchDocuments();
    fetchChunks();
    fetchStats();
    checkStoredUser();
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) setApiStatus(true);
      else setApiStatus(false);
    } catch {
      setApiStatus(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${API_BASE}/knowledge`);
      const data = await res.json();
      if (data.success) setDocuments(data.documents);
    } catch (err) {
      console.warn("Failed to fetch documents:", err);
    }
  };

  const fetchChunks = async () => {
    try {
      const res = await fetch(`${API_BASE}/knowledge/chunks`);
      const data = await res.json();
      if (data.success) setChunks(data.chunks);
    } catch (err) {
      console.warn("Failed to fetch vector chunks:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (err) {
      console.warn("Failed to fetch stats:", err);
    }
  };

  const checkStoredUser = async () => {
    const token = localStorage.getItem('aits_token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setUser(data.user);
      else localStorage.removeItem('aits_token');
    } catch {
      localStorage.removeItem('aits_token');
    }
  };

  // Chat Query Handler
  const handleSendMessage = async (messageText, categoryFilter) => {
    setIsLoadingChat(true);
    try {
      const res = await fetch(`${API_BASE}/chat/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, categoryFilter })
      });
      const data = await res.json();
      if (data.success) {
        setChatHistory((prev) => [...prev, data.userMessage, data.botResponse]);
      }
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { id: `usr-${Date.now()}`, sender: 'user', text: messageText },
        { id: `bot-${Date.now()}`, sender: 'bot', text: 'Error connecting to RAG backend server. Please verify backend service is running.' }
      ]);
    } finally {
      setIsLoadingChat(false);
      fetchStats();
    }
  };

  const handleClearHistory = async () => {
    try {
      await fetch(`${API_BASE}/chat/history`, { method: 'DELETE' });
    } catch {}
    setChatHistory([
      {
        id: "msg-welcome",
        sender: "bot",
        text: "Chat history cleared. How can I assist you with AITS college information?",
        timestamp: new Date().toISOString(),
        citations: [],
        confidenceScore: 1.0
      }
    ]);
    showToast("Chat history cleared", "info");
  };

  // Ingest Document Handler
  const handleIngestDocument = async (docData) => {
    try {
      const res = await fetch(`${API_BASE}/knowledge/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docData)
      });
      const data = await res.json();
      if (data.success) {
        fetchDocuments();
        fetchChunks();
        fetchStats();
        showToast("Document ingested successfully!", "success");
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Delete Document Handler
  const handleDeleteDocument = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/knowledge/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchDocuments();
        fetchChunks();
        fetchStats();
        showToast("Document removed from knowledge base", "info");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Auth Handlers
  const handleLogin = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('aits_token', data.token);
        setUser(data.user);
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const handleRegister = async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('aits_token', data.token);
        setUser(data.user);
        showToast(`Account created successfully! Welcome, ${data.user.name}`, 'success');
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const handleLogout = () => {
    const userName = user?.name || 'User';
    localStorage.removeItem('aits_token');
    setUser(null);
    showToast(`Signed out successfully. Goodbye ${userName}!`, 'info');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Toast Notification Notification Banner */}
      {toast && (
        <div 
          style={{ 
            position: 'fixed', 
            top: '80px', 
            right: '24px', 
            zIndex: 1000, 
            background: toast.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : toast.type === 'error' ? 'rgba(244, 63, 94, 0.95)' : 'rgba(6, 182, 212, 0.95)',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            fontWeight: 500,
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          {toast.type === 'success' && <CheckCircle2 size={18} />}
          {toast.type === 'error' && <AlertCircle size={18} />}
          {toast.type === 'info' && <Info size={18} />}
          <span>{toast.message}</span>
          <button 
            onClick={() => setToast(null)} 
            style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', marginLeft: '8px', opacity: 0.8 }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        apiStatus={apiStatus}
      />

      {/* Main View Switcher */}
      <main style={{ flex: 1 }}>
        {activeTab === 'chat' && (
          <ChatInterface
            history={chatHistory}
            onSendMessage={handleSendMessage}
            onClearHistory={handleClearHistory}
            isLoading={isLoadingChat}
          />
        )}

        {activeTab === 'courses' && (
          <CourseDirectory
            onQueryChat={(query) => {
              setActiveTab('chat');
              handleSendMessage(query, 'Academics');
            }}
          />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeHub
            documents={documents}
            chunks={chunks}
            onIngestDocument={handleIngestDocument}
            onDeleteDocument={handleDeleteDocument}
            onRefresh={() => {
              fetchDocuments();
              fetchChunks();
              fetchStats();
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView stats={stats} />
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-glass)', padding: '16px 24px', background: 'rgba(7, 12, 24, 0.9)', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        © 2026 Apex Institute of Technology & Science • Grounded RAG AI System • Built for Academic Operations & Student Success
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
}
