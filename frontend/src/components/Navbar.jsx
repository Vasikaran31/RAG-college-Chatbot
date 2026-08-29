import React from 'react';
import { 
  Bot, 
  Database, 
  GraduationCap, 
  BarChart3, 
  LogIn, 
  LogOut, 
  Sparkles, 
  CheckCircle2,
  AlertCircle,
  UserCheck
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onOpenAuth, onLogout, apiStatus }) {
  // Helper to extract user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand Logo & College Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('chat')}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--gradient-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}>
            <Bot size={26} color="#04111d" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff, #a7f3d0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                CampusMind RAG
              </h1>
              <span className="badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={11} /> Grounded AI
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Apex Institute of Technology & Science
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '6px', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
          <button
            id="tab-chat"
            className={`btn-secondary ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
            style={{
              background: activeTab === 'chat' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              borderColor: activeTab === 'chat' ? 'var(--accent-emerald)' : 'transparent',
              color: activeTab === 'chat' ? '#34d399' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              padding: '8px 14px'
            }}
          >
            <Bot size={16} /> RAG Assistant
          </button>

          <button
            id="tab-courses"
            className={`btn-secondary ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
            style={{
              background: activeTab === 'courses' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              borderColor: activeTab === 'courses' ? 'var(--accent-emerald)' : 'transparent',
              color: activeTab === 'courses' ? '#34d399' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              padding: '8px 14px'
            }}
          >
            <GraduationCap size={16} /> Course Directory
          </button>

          <button
            id="tab-knowledge"
            className={`btn-secondary ${activeTab === 'knowledge' ? 'active' : ''}`}
            onClick={() => setActiveTab('knowledge')}
            style={{
              background: activeTab === 'knowledge' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              borderColor: activeTab === 'knowledge' ? 'var(--accent-emerald)' : 'transparent',
              color: activeTab === 'knowledge' ? '#34d399' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              padding: '8px 14px'
            }}
          >
            <Database size={16} /> Knowledge Hub
          </button>

          <button
            id="tab-analytics"
            className={`btn-secondary ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
            style={{
              background: activeTab === 'analytics' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              borderColor: activeTab === 'analytics' ? 'var(--accent-emerald)' : 'transparent',
              color: activeTab === 'analytics' ? '#34d399' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              padding: '8px 14px'
            }}
          >
            <BarChart3 size={16} /> Analytics
          </button>
        </nav>

        {/* User Auth & Status Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* API Health Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: apiStatus ? '#34d399' : '#f43f5e', background: 'rgba(15, 23, 42, 0.5)', padding: '6px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-glass)' }}>
            {apiStatus ? <CheckCircle2 size={12} color="#10b981" /> : <AlertCircle size={12} color="#f43f5e" />}
            <span>{apiStatus ? 'Backend API Active' : 'Connecting API...'}</span>
          </div>

          {user ? (
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '6px 12px 6px 8px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              {/* User Avatar Circle */}
              <div 
                style={{ 
                  width: '34px', 
                  height: '34px', 
                  borderRadius: '50%', 
                  background: 'var(--gradient-emerald)', 
                  color: '#04111d',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)'
                }}
              >
                {getInitials(user.name)}
              </div>

              {/* User Meta Info */}
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</span>
                  <span className="badge-purple" style={{ fontSize: '0.62rem', padding: '1px 6px', textTransform: 'uppercase' }}>
                    {user.role}
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.department || 'General'}</span>
              </div>

              {/* Logout Action Button */}
              <button 
                id="btn-logout"
                className="btn-secondary" 
                onClick={onLogout}
                style={{ 
                  padding: '6px 10px', 
                  fontSize: '0.78rem',
                  borderColor: 'rgba(244, 63, 94, 0.3)',
                  color: '#f43f5e',
                  marginLeft: '4px'
                }}
                title="Sign Out"
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button 
              id="btn-open-auth"
              className="btn-primary" 
              onClick={onOpenAuth}
              style={{ fontSize: '0.85rem', padding: '8px 18px', borderRadius: 'var(--radius-full)' }}
            >
              <LogIn size={15} /> Sign In / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
