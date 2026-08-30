import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import ChatInterface from './components/ChatInterface';
import KnowledgeHub from './components/KnowledgeHub';
import CourseDirectory from './components/CourseDirectory';
import AnalyticsView from './components/AnalyticsView';
import AuthModal from './components/AuthModal';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/* ── Helper: Build a fresh welcome message ── */
const makeWelcome = (userName) => ({
  id: `msg-welcome-${Date.now()}`,
  sender: "bot",
  text: `Hello${userName ? ' ' + userName : ''}! Welcome to Apex Institute of Technology & Science (AITS) Assistant. How can I help you today with admissions, courses, fees, or hostel facilities?`,
  timestamp: new Date().toISOString(),
  citations: [],
  confidenceScore: 1.0
});

export default function App() {
  /* ── Core UI state ── */
  const [activeTab, setActiveTab] = useState('chat');
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState(false);
  const [toast, setToast] = useState(null);

  /* ── Chat session state ──
   *  chatSessionId is a counter that increments on EVERY user switch.
   *  It is used as the React `key` on ChatInterface, forcing a full
   *  unmount → remount.  The sessionRef tracks the "live" session so
   *  in-flight API responses from a stale session are silently dropped.
   */
  const [chatSessionId, setChatSessionId] = useState(1);
  const sessionRef = useRef(1);

  const [chatHistory, setChatHistory] = useState([makeWelcome()]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const [documents, setDocuments] = useState([]);
  const [chunks, setChunks] = useState([]);
  const [stats, setStats] = useState(null);

  /* ── Toast ── */
  const showToast = (message, type = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  /* ── Reset the chat to a clean welcome ── */
  const resetChatSession = useCallback((userName) => {
    const nextId = sessionRef.current + 1;
    sessionRef.current = nextId;
    setChatSessionId(nextId);
    setChatHistory([makeWelcome(userName)]);
  }, []);

  /* ── Backend health, docs, chunks, stats ── */
  useEffect(() => {
    fetchHealthWithRetry();
    fetchDocuments();
    fetchChunks();
    fetchStats();
    checkStoredUser();
  }, []);

  const fetchHealthWithRetry = async (retries = 3) => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) { setApiStatus(true); }
      else if (retries > 0) { setTimeout(() => fetchHealthWithRetry(retries - 1), 4000); }
      else { setApiStatus(false); }
    } catch {
      if (retries > 0) { setTimeout(() => fetchHealthWithRetry(retries - 1), 4000); }
      else { setApiStatus(false); }
    }
  };

  const fetchDocuments = async () => {
    try { const r = await fetch(`${API_BASE}/knowledge`); const d = await r.json(); if (d.success) setDocuments(d.documents); }
    catch (e) { console.warn("Failed to fetch documents:", e); }
  };

  const fetchChunks = async () => {
    try { const r = await fetch(`${API_BASE}/knowledge/chunks`); const d = await r.json(); if (d.success) setChunks(d.chunks); }
    catch (e) { console.warn("Failed to fetch vector chunks:", e); }
  };

  const fetchStats = async () => {
    try { const r = await fetch(`${API_BASE}/stats`); const d = await r.json(); if (d.success) setStats(d.stats); }
    catch (e) { console.warn("Failed to fetch stats:", e); }
  };

  const checkStoredUser = async () => {
    const token = localStorage.getItem('aits_token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        resetChatSession(data.user.name);
      } else {
        localStorage.removeItem('aits_token');
      }
    } catch {
      localStorage.removeItem('aits_token');
    }
  };

  /* ── Fetch with retry (Render cold-start) ── */
  const fetchWithRetry = async (url, options, retries = 2) => {
    try {
      const res = await fetch(url, options);
      if (!res.ok && retries > 0) { await new Promise((r) => setTimeout(r, 3000)); return fetchWithRetry(url, options, retries - 1); }
      return res;
    } catch (err) {
      if (retries > 0) { await new Promise((r) => setTimeout(r, 3000)); return fetchWithRetry(url, options, retries - 1); }
      throw err;
    }
  };

  /* ── Chat: Send Message ──
   *  Captures sessionRef.current BEFORE the await.  If the user switches
   *  accounts while the request is in flight, the response is dropped
   *  because the captured snapshot no longer matches the live ref.
   */
  const handleSendMessage = async (messageText, categoryFilter) => {
    const snapshotSession = sessionRef.current;          // capture
    setIsLoadingChat(true);
    try {
      const res = await fetchWithRetry(`${API_BASE}/chat/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          categoryFilter,
          userId: user ? user.id : 'guest',
          userName: user ? user.name : 'Guest'
        })
      });
      const data = await res.json();
      if (data.success && sessionRef.current === snapshotSession) {
        setChatHistory((prev) => [...prev, data.userMessage, data.botResponse]);
        setApiStatus(true);
      }
    } catch {
      if (sessionRef.current === snapshotSession) {
        setChatHistory((prev) => [
          ...prev,
          { id: `usr-${Date.now()}`, sender: 'user', text: messageText },
          { id: `bot-${Date.now()}`, sender: 'bot', text: 'Backend server is starting up or unreachable. Please wait ~20 seconds for Render server to wake up, or check VITE_API_BASE_URL setting.' }
        ]);
        setApiStatus(false);
      }
    } finally {
      setIsLoadingChat(false);
      fetchStats();
    }
  };

  /* ── Chat: Clear History ── */
  const handleClearHistory = async () => {
    try {
      await fetch(`${API_BASE}/chat/history`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user ? user.id : 'guest' })
      });
    } catch {}
    resetChatSession(user?.name);
    showToast("Chat history cleared", "info");
  };

  /* ── Knowledge Base ── */
  const handleIngestDocument = async (docData) => {
    try {
      const res = await fetch(`${API_BASE}/knowledge/upload`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(docData) });
      const data = await res.json();
      if (data.success) { fetchDocuments(); fetchChunks(); fetchStats(); showToast("Document ingested successfully!", "success"); return { success: true }; }
      return { success: false, message: data.message };
    } catch (err) { return { success: false, message: err.message }; }
  };

  const handleDeleteDocument = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/knowledge/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { fetchDocuments(); fetchChunks(); fetchStats(); showToast("Document removed from knowledge base", "info"); }
    } catch (err) { console.error("Delete failed:", err); }
  };

  /* ═══════════════════════════════════════════════
   *  AUTH HANDLERS — these are the key user-switch
   *  points.  Every one calls resetChatSession()
   *  which bumps the session counter, changes the
   *  React key, and sets chatHistory to a single
   *  fresh welcome message.
   * ═══════════════════════════════════════════════ */

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
        resetChatSession(data.user.name);                // ← wipe chat
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) { return { success: false, message: err.message }; }
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
        resetChatSession(data.user.name);                // ← wipe chat
        showToast(`Account created successfully! Welcome, ${data.user.name}`, 'success');
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) { return { success: false, message: err.message }; }
  };

  const handleLogout = () => {
    const userName = user?.name || 'User';
    localStorage.removeItem('aits_token');
    setUser(null);
    resetChatSession();                                  // ← wipe chat
    showToast(`Signed out successfully. Goodbye ${userName}!`, 'info');
  };

  /* ── Render ── */
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Toast Notification Banner */}
      {toast && (
        <div
          style={{
            position: 'fixed', top: '80px', right: '24px', zIndex: 1000,
            background: toast.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : toast.type === 'error' ? 'rgba(244, 63, 94, 0.95)' : 'rgba(6, 182, 212, 0.95)',
            color: '#ffffff', padding: '12px 20px', borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
            gap: '10px', fontSize: '0.9rem', fontWeight: 500, backdropFilter: 'blur(8px)'
          }}
        >
          {toast.type === 'success' && <CheckCircle2 size={18} />}
          {toast.type === 'error' && <AlertCircle size={18} />}
          {toast.type === 'info' && <Info size={18} />}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', marginLeft: '8px', opacity: 0.8 }}>
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
            key={`chat-session-${chatSessionId}`}
            history={chatHistory}
            onSendMessage={handleSendMessage}
            onClearHistory={handleClearHistory}
            isLoading={isLoadingChat}
          />
        )}

        {activeTab === 'courses' && (
          <CourseDirectory
            onQueryChat={(query) => { setActiveTab('chat'); handleSendMessage(query, 'Academics'); }}
          />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeHub
            documents={documents}
            chunks={chunks}
            onIngestDocument={handleIngestDocument}
            onDeleteDocument={handleDeleteDocument}
            onRefresh={() => { fetchDocuments(); fetchChunks(); fetchStats(); }}
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
