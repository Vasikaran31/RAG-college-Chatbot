import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import ChatInterface from './components/ChatInterface';
import KnowledgeHub from './components/KnowledgeHub';
import CourseDirectory from './components/CourseDirectory';
import AnalyticsView from './components/AnalyticsView';
import AuthModal from './components/AuthModal';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/* ═══════════════════════════════════════════════
 *  HELPERS
 * ═══════════════════════════════════════════════ */

/** Generate a collision-safe unique ID */
const uid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/** Build a fresh welcome message */
const makeWelcome = (userName) => ({
  id: uid('msg-welcome'),
  sender: 'bot',
  text: `Hello${userName ? ' ' + userName : ''}! Welcome to Apex Institute of Technology & Science (AITS) Assistant. How can I help you today with admissions, courses, fees, or hostel facilities?`,
  timestamp: new Date().toISOString(),
  citations: [],
  confidenceScore: 1.0,
});

/** localStorage key for a user's chat history */
const chatStorageKey = (userId) => `aits_chat_${userId || 'guest'}`;

/** Save chat array to localStorage */
const saveChatToStorage = (userId, messages) => {
  try {
    localStorage.setItem(chatStorageKey(userId), JSON.stringify(messages));
  } catch { /* storage full — silently ignore */ }
};

/** Load chat array from localStorage (returns null if nothing saved) */
const loadChatFromStorage = (userId) => {
  try {
    const raw = localStorage.getItem(chatStorageKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* corrupt data — ignore */ }
  return null;
};

/** Clear chat from localStorage */
const clearChatStorage = (userId) => {
  try { localStorage.removeItem(chatStorageKey(userId)); } catch {}
};

/** Decode a JWT payload without any library (no verification — display only) */
const decodeJwtPayload = (token) => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch { return null; }
};

/* ═══════════════════════════════════════════════
 *  APP COMPONENT
 * ═══════════════════════════════════════════════ */
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

  /* Ref that always holds the latest user — prevents stale closures */
  const userRef = useRef(null);
  useEffect(() => { userRef.current = user; }, [user]);

  const [documents, setDocuments] = useState([]);
  const [chunks, setChunks] = useState([]);
  const [stats, setStats] = useState(null);

  /* ── Toast ── */
  const showToast = (message, type = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  /* ── Persist chat whenever it changes ── */
  useEffect(() => {
    const userId = userRef.current ? userRef.current.id : 'guest';
    saveChatToStorage(userId, chatHistory);
  }, [chatHistory]);

  /* ── Reset the chat to a clean welcome (or load from storage) ── */
  const resetChatSession = useCallback((userId, userName) => {
    const nextId = sessionRef.current + 1;
    sessionRef.current = nextId;
    setChatSessionId(nextId);

    // Try to load persisted history for this user
    const saved = loadChatFromStorage(userId);
    if (saved) {
      setChatHistory(saved);
    } else {
      setChatHistory([makeWelcome(userName)]);
    }
  }, []);

  /* ═══════════════════════════════════════════════
   *  BOOT SEQUENCE
   * ═══════════════════════════════════════════════ */
  useEffect(() => {
    restoreUserSession();
    fetchHealthWithRetry();
    fetchDocuments();
    fetchChunks();
    fetchStats();
  }, []);

  /**
   * Restore user session on mount:
   *  1. Immediately decode the JWT to get user info (no network wait).
   *  2. Load chat from localStorage for that user.
   *  3. Validate token against the backend in the background.
   */
  const restoreUserSession = async () => {
    const token = localStorage.getItem('aits_token');
    if (!token) return;

    // Step 1: Instant JWT decode — user appears logged in immediately
    const payload = decodeJwtPayload(token);
    if (payload && payload.id && payload.name) {
      const decodedUser = {
        id: payload.id,
        name: payload.name,
        email: payload.email || '',
        role: payload.role || 'student',
        department: payload.department || 'General',
      };
      setUser(decodedUser);
      userRef.current = decodedUser;

      // Step 2: Load persisted chat for this user
      resetChatSession(decodedUser.id, decodedUser.name);
    }

    // Step 3: Background validation against the backend
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        // Refresh user with full server data (may include updated department etc.)
        setUser(data.user);
        userRef.current = data.user;
      } else {
        // Token invalid on server — sign out
        localStorage.removeItem('aits_token');
        setUser(null);
        userRef.current = null;
        resetChatSession('guest', null);
      }
    } catch {
      // Backend unreachable (Render cold start) — keep the decoded user, it's fine
      console.warn('Backend unreachable for /auth/me — keeping JWT-decoded session');
    }
  };

  /* ── Backend health check with retry ── */
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
    catch (e) { console.warn('Failed to fetch documents:', e); }
  };

  const fetchChunks = async () => {
    try { const r = await fetch(`${API_BASE}/knowledge/chunks`); const d = await r.json(); if (d.success) setChunks(d.chunks); }
    catch (e) { console.warn('Failed to fetch vector chunks:', e); }
  };

  const fetchStats = async () => {
    try { const r = await fetch(`${API_BASE}/stats`); const d = await r.json(); if (d.success) setStats(d.stats); }
    catch (e) { console.warn('Failed to fetch stats:', e); }
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

  /* ═══════════════════════════════════════════════
   *  CHAT HANDLERS
   * ═══════════════════════════════════════════════ */

  /**
   * Send a message.  Uses userRef (not user) to avoid stale closures.
   * Captures sessionRef snapshot to discard in-flight responses if user switches.
   */
  const handleSendMessage = async (messageText, categoryFilter) => {
    const snapshotSession = sessionRef.current;
    const currentUser = userRef.current;
    setIsLoadingChat(true);

    try {
      const res = await fetchWithRetry(`${API_BASE}/chat/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          categoryFilter,
          userId: currentUser ? currentUser.id : 'guest',
          userName: currentUser ? currentUser.name : 'Guest',
        }),
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
          { id: uid('usr'), sender: 'user', text: messageText },
          { id: uid('bot'), sender: 'bot', text: 'Backend server is starting up or unreachable. Please wait ~20 seconds for Render server to wake up, or check VITE_API_BASE_URL setting.' },
        ]);
        setApiStatus(false);
      }
    } finally {
      setIsLoadingChat(false);
      fetchStats();
    }
  };

  const handleClearHistory = async () => {
    const currentUser = userRef.current;
    try {
      await fetch(`${API_BASE}/chat/history`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser ? currentUser.id : 'guest' }),
      });
    } catch {}
    clearChatStorage(currentUser ? currentUser.id : 'guest');
    resetChatSession(currentUser ? currentUser.id : 'guest', currentUser?.name);
    // Overwrite with a "cleared" welcome instead of persisted
    const clearedWelcome = [{
      id: uid('msg-cleared'),
      sender: 'bot',
      text: 'Chat history cleared. How can I assist you with AITS college information?',
      timestamp: new Date().toISOString(),
      citations: [],
      confidenceScore: 1.0,
    }];
    setChatHistory(clearedWelcome);
    saveChatToStorage(currentUser ? currentUser.id : 'guest', clearedWelcome);
    showToast('Chat history cleared', 'info');
  };

  /* ═══════════════════════════════════════════════
   *  KNOWLEDGE BASE HANDLERS
   * ═══════════════════════════════════════════════ */
  const handleIngestDocument = async (docData) => {
    try {
      const res = await fetch(`${API_BASE}/knowledge/upload`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(docData) });
      const data = await res.json();
      if (data.success) { fetchDocuments(); fetchChunks(); fetchStats(); showToast('Document ingested successfully!', 'success'); return { success: true }; }
      return { success: false, message: data.message };
    } catch (err) { return { success: false, message: err.message }; }
  };

  const handleDeleteDocument = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/knowledge/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { fetchDocuments(); fetchChunks(); fetchStats(); showToast('Document removed from knowledge base', 'info'); }
    } catch (err) { console.error('Delete failed:', err); }
  };

  /* ═══════════════════════════════════════════════
   *  AUTH HANDLERS
   *  Every handler calls resetChatSession() which:
   *   1. Bumps sessionRef counter (drops in-flight responses)
   *   2. Changes chatSessionId (forces ChatInterface remount)
   *   3. Loads persisted chat from localStorage (or fresh welcome)
   * ═══════════════════════════════════════════════ */

  const handleLogin = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('aits_token', data.token);
        setUser(data.user);
        userRef.current = data.user;
        resetChatSession(data.user.id, data.user.name);
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
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('aits_token', data.token);
        setUser(data.user);
        userRef.current = data.user;
        // New user — clear any stale guest storage and start fresh
        clearChatStorage(data.user.id);
        resetChatSession(data.user.id, data.user.name);
        showToast(`Account created successfully! Welcome, ${data.user.name}`, 'success');
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) { return { success: false, message: err.message }; }
  };

  const handleLogout = () => {
    const userName = userRef.current?.name || 'User';
    localStorage.removeItem('aits_token');
    setUser(null);
    userRef.current = null;
    resetChatSession('guest', null);
    showToast(`Signed out successfully. Goodbye ${userName}!`, 'info');
  };

  /* ═══════════════════════════════════════════════
   *  RENDER
   * ═══════════════════════════════════════════════ */
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
            gap: '10px', fontSize: '0.9rem', fontWeight: 500, backdropFilter: 'blur(8px)',
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
