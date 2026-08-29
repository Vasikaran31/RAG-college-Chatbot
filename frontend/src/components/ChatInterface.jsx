import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Trash2, 
  ChevronRight, 
  FileText, 
  Info,
  Building,
  DollarSign,
  Briefcase,
  HelpCircle
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  { icon: FileText, label: "Admissions & JEE Ranks", query: "What are the JEE Main rank requirements, eligibility criteria, and application deadlines for 2026?" },
  { icon: DollarSign, label: "Tuition Fees & Scholarships", query: "What are the B.Tech tuition fees in Rupees and available Founder Merit scholarships?" },
  { icon: BookOpen, label: "Computer Science Curriculum", query: "Tell me about the B.Tech Computer Science & AI degree courses and lab facilities." },
  { icon: Building, label: "Hostels & Mess Charges", query: "What hostel room options and mess charges are available on campus in INR?" },
  { icon: Briefcase, label: "Placement Statistics & LPA", query: "What is the highest and average LPA salary package for CS students?" },
];

const CATEGORIES = ["All", "Admissions", "Academics", "Financials", "Campus Life", "Placements", "FAQs"];

export default function ChatInterface({ history, onSendMessage, onClearHistory, isLoading }) {
  const [inputText, setInputText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeCitationModal, setActiveCitationModal] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText, selectedCategory);
    setInputText("");
  };

  const handlePromptClick = (queryText) => {
    if (isLoading) return;
    onSendMessage(queryText, selectedCategory);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
      
      {/* Top Banner / Filter Controls */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={20} color="#10b981" />
          <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Retrieval-Augmented Generation (RAG) active with direct source grounding
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Filter Domain:</label>
          <select
            id="select-category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-primary)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button
            id="btn-clear-chat"
            className="btn-secondary"
            onClick={onClearHistory}
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            title="Clear Chat History"
          >
            <Trash2 size={14} /> Clear History
          </button>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
        {SUGGESTED_PROMPTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              className="btn-secondary"
              onClick={() => handlePromptClick(item.query)}
              style={{
                fontSize: '0.8rem',
                whiteSpace: 'nowrap',
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.08)',
                borderColor: 'rgba(16, 185, 129, 0.2)'
              }}
            >
              <Icon size={14} color="#34d399" /> {item.label}
            </button>
          );
        })}
      </div>

      {/* Main Chat Box Container */}
      <div className="glass-panel" style={{ height: '580px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Messages Feed */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {history.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start'
                }}
              >
                {!isUser && (
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--gradient-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={20} color="#04111d" />
                  </div>
                )}

                <div
                  style={{
                    maxWidth: '80%',
                    background: isUser ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.9)',
                    border: `1px solid ${isUser ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-glass)'}`,
                    borderRadius: '16px',
                    borderTopRightRadius: isUser ? '2px' : '16px',
                    borderTopLeftRadius: !isUser ? '2px' : '16px',
                    padding: '16px 18px',
                    boxShadow: isUser ? 'none' : '0 4px 20px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Sender Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isUser ? '#34d399' : 'var(--text-secondary)' }}>
                      {isUser ? 'You' : 'AITS Assistant (RAG Grounded)'}
                    </span>
                    {!isUser && msg.confidenceScore && (
                      <span className="badge-emerald" style={{ fontSize: '0.7rem' }}>
                        {(msg.confidenceScore * 100).toFixed(0)}% Confidence
                      </span>
                    )}
                  </div>

                  {/* Message Content */}
                  <div 
                    className="prose-chat"
                    style={{ fontSize: '0.92rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}
                  >
                    {msg.text}
                  </div>

                  {/* Citations & Source Footers */}
                  {!isUser && msg.citations && msg.citations.length > 0 && (
                    <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <BookOpen size={12} /> Grounded Sources & Citations:
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {msg.citations.map((cite) => (
                          <button
                            key={cite.citationId}
                            className="btn-secondary"
                            onClick={() => setActiveCitationModal(cite)}
                            style={{
                              fontSize: '0.75rem',
                              padding: '4px 10px',
                              borderRadius: 'var(--radius-sm)',
                              background: 'rgba(6, 182, 212, 0.1)',
                              borderColor: 'rgba(6, 182, 212, 0.25)',
                              color: '#67e8f9'
                            }}
                          >
                            <FileText size={12} /> {cite.documentTitle} ({cite.citationId})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={20} color="var(--text-primary)" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Skeleton */}
          {isLoading && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--gradient-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} color="#04111d" />
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-glass)', width: '60%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Sparkles size={14} className="skeleton" color="#10b981" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Searching vector database index...</span>
                </div>
                <div className="skeleton" style={{ height: '14px', width: '90%', marginBottom: '8px' }}></div>
                <div className="skeleton" style={{ height: '14px', width: '75%', marginBottom: '8px' }}></div>
                <div className="skeleton" style={{ height: '14px', width: '40%' }}></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Query Input Form */}
        <form onSubmit={handleSubmit} style={{ padding: '16px', background: 'rgba(10, 16, 30, 0.9)', borderTop: '1px solid var(--border-glass)', display: 'flex', gap: '12px' }}>
          <input
            id="input-chat-message"
            type="text"
            className="input-field"
            placeholder="Ask any question about AITS admissions, courses, fees, hostels..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
          />
          <button
            id="btn-send-message"
            type="submit"
            className="btn-primary"
            disabled={!inputText.trim() || isLoading}
            style={{ padding: '0 24px' }}
          >
            <Send size={18} /> Send
          </button>
        </form>
      </div>

      {/* Citation Detail Modal */}
      {activeCitationModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '24px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={22} color="#06b6d4" />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{activeCitationModal.documentTitle}</h3>
                  <span className="badge-cyan" style={{ fontSize: '0.7rem' }}>{activeCitationModal.category} • {activeCitationModal.department}</span>
                </div>
              </div>
              <button
                className="btn-secondary"
                onClick={() => setActiveCitationModal(null)}
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
              >
                ✕ Close
              </button>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.6, marginBottom: '16px' }}>
              <p style={{ fontWeight: 600, color: '#38bdf8', marginBottom: '6px', fontSize: '0.75rem' }}>RETRIEVED VECTOR CHUNK TEXT:</p>
              "{activeCitationModal.snippet}"
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>Chunk ID: {activeCitationModal.chunkId}</span>
              <span className="badge-emerald">Match Relevance Score: {(activeCitationModal.relevanceScore * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
