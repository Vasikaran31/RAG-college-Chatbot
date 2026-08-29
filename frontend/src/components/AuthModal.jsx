import React, { useState, useEffect, useRef } from 'react';
import { 
  LogIn, 
  UserPlus, 
  Sparkles, 
  User, 
  Lock, 
  Mail, 
  Building,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLogin, onRegister }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [department, setDepartment] = useState('Computer Science');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const emailInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setTimeout(() => emailInputRef.current?.focus(), 120);
    }
  }, [isOpen, isRegisterMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (isRegisterMode && !name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setIsSubmitting(true);

    let res;
    if (isRegisterMode) {
      res = await onRegister({ name: name.trim(), email: email.trim(), password, role, department });
    } else {
      res = await onLogin(email.trim(), password);
    }
    setIsSubmitting(false);

    if (res && res.success) {
      setEmail('');
      setPassword('');
      setName('');
      onClose();
    } else {
      setErrorMsg(res?.message || 'Authentication failed. Please check your details.');
    }
  };

  return (
    <div 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        background: 'rgba(3, 7, 18, 0.88)', 
        backdropFilter: 'blur(20px)', 
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        zIndex: 1000, 
        padding: '20px' 
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="glass-panel" 
        style={{ 
          width: '100%', 
          maxWidth: '460px', 
          padding: '36px 32px', 
          position: 'relative',
          borderRadius: '24px',
          boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%)'
        }}
      >
        {/* Close Button */}
        <button
          className="btn-secondary"
          onClick={onClose}
          style={{ 
            position: 'absolute', 
            right: '20px', 
            top: '20px', 
            width: '34px',
            height: '34px',
            padding: 0,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: 'rgba(255,255,255,0.15)'
          }}
          title="Close Modal"
        >
          <X size={16} color="var(--text-secondary)" />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div 
            style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '18px', 
              background: 'var(--gradient-emerald)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 16px',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.35)'
            }}
          >
            <GraduationCap size={30} color="#04111d" />
          </div>
          
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            {isRegisterMode ? 'Create Campus Account' : 'Welcome Back'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Apex Institute of Technology & Science • CampusMind RAG
          </p>
        </div>

        {/* Segmented Tab Switcher */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '4px', 
            background: 'rgba(15, 23, 42, 0.8)', 
            padding: '4px', 
            borderRadius: 'var(--radius-sm)', 
            border: '1px solid var(--border-glass)',
            marginBottom: '24px' 
          }}
        >
          <button
            type="button"
            onClick={() => { setIsRegisterMode(false); setErrorMsg(null); }}
            style={{
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              background: !isRegisterMode ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: !isRegisterMode ? '#34d399' : 'var(--text-secondary)',
              fontWeight: !isRegisterMode ? 600 : 500,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <LogIn size={15} /> Sign In
          </button>

          <button
            type="button"
            onClick={() => { setIsRegisterMode(true); setErrorMsg(null); }}
            style={{
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              background: isRegisterMode ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: isRegisterMode ? '#34d399' : 'var(--text-secondary)',
              fontWeight: isRegisterMode ? 600 : 500,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <UserPlus size={15} /> Register
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div 
            style={{ 
              background: 'rgba(244, 63, 94, 0.15)', 
              border: '1px solid rgba(244, 63, 94, 0.4)', 
              padding: '12px 14px', 
              borderRadius: 'var(--radius-sm)', 
              color: '#fecdd3', 
              fontSize: '0.85rem', 
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <AlertCircle size={18} color="#f43f5e" style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {isRegisterMode && (
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="input-auth-name"
                  type="text"
                  className="input-field"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '40px', borderRadius: '12px' }}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                ref={emailInputRef}
                id="input-auth-email"
                type="email"
                className="input-field"
                placeholder="student@aits.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '40px', borderRadius: '12px' }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="input-auth-password"
                type={showPassword ? "text" : "password"}
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px', paddingRight: '42px', borderRadius: '12px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px'
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {isRegisterMode && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Role
                </label>
                <select className="input-field" value={role} onChange={(e) => setRole(e.target.value)} style={{ borderRadius: '12px' }}>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Department
                </label>
                <select className="input-field" value={department} onChange={(e) => setDepartment(e.target.value)} style={{ borderRadius: '12px' }}>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Finance">Finance</option>
                  <option value="Administration">Administration</option>
                </select>
              </div>
            </div>
          )}

          <button 
            id="btn-auth-submit" 
            type="submit" 
            className="btn-primary" 
            disabled={isSubmitting} 
            style={{ 
              marginTop: '6px', 
              justifyContent: 'center', 
              padding: '13px', 
              fontSize: '0.95rem',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            {isSubmitting ? (
              <span>{isRegisterMode ? 'Creating Account...' : 'Authenticating...'}</span>
            ) : (
              <>
                {isRegisterMode ? <UserPlus size={18} /> : <LogIn size={18} />}
                <span>{isRegisterMode ? 'Create Campus Account' : 'Sign In'}</span>
              </>
            )}
          </button>
        </form>

        {/* Security Badge Footer */}
        <div style={{ marginTop: '24px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <ShieldCheck size={14} color="#10b981" />
          <span>Grounded JWT Security • Apex Institute of Technology & Science</span>
        </div>
      </div>
    </div>
  );
}
