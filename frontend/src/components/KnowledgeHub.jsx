import React, { useState, useEffect } from 'react';
import { 
  Database, 
  UploadCloud, 
  Trash2, 
  FileText, 
  Layers, 
  PlusCircle, 
  CheckCircle2, 
  RefreshCw,
  Search,
  BookOpen
} from 'lucide-react';

export default function KnowledgeHub({ documents, chunks, onIngestDocument, onDeleteDocument, onRefresh }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Admissions');
  const [department, setDepartment] = useState('Administration');
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState('documents'); // 'documents' | 'chunks' | 'upload'
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleSubmitIngest = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const result = await onIngestDocument({ title, category, department, content });
    setIsSubmitting(false);

    if (result.success) {
      setStatusMsg({ type: 'success', text: 'Document ingested & vector store re-indexed successfully!' });
      setTitle('');
      setContent('');
      setActiveTab('documents');
      setTimeout(() => setStatusMsg(null), 4000);
    } else {
      setStatusMsg({ type: 'error', text: result.message || 'Ingestion failed' });
    }
  };

  const filteredDocs = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChunks = chunks.filter(
    (c) =>
      c.docTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 16px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={28} color="#10b981" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              AITS RAG Knowledge Base Hub
            </h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage grounded college knowledge base documents, monitor vector chunk index, and ingest new materials.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={onRefresh} style={{ fontSize: '0.85rem' }}>
            <RefreshCw size={14} /> Refresh Index
          </button>
          <button className="btn-primary" onClick={() => setActiveTab('upload')} style={{ fontSize: '0.85rem' }}>
            <PlusCircle size={16} /> Ingest Document
          </button>
        </div>
      </div>

      {statusMsg && (
        <div style={{ background: statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)', border: `1px solid ${statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`, padding: '12px 16px', borderRadius: 'var(--radius-sm)', color: '#ffffff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} color={statusMsg.type === 'success' ? '#10b981' : '#f43f5e'} />
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Internal Navigation & Search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
          <button
            id="tab-kb-docs"
            className="btn-secondary"
            onClick={() => setActiveTab('documents')}
            style={{
              background: activeTab === 'documents' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              borderColor: activeTab === 'documents' ? 'var(--accent-emerald)' : 'transparent',
              color: activeTab === 'documents' ? '#34d399' : 'var(--text-secondary)',
              fontSize: '0.85rem'
            }}
          >
            <FileText size={14} /> Documents ({documents.length})
          </button>

          <button
            id="tab-kb-chunks"
            className="btn-secondary"
            onClick={() => setActiveTab('chunks')}
            style={{
              background: activeTab === 'chunks' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              borderColor: activeTab === 'chunks' ? 'var(--accent-emerald)' : 'transparent',
              color: activeTab === 'chunks' ? '#34d399' : 'var(--text-secondary)',
              fontSize: '0.85rem'
            }}
          >
            <Layers size={14} /> Vector Chunks ({chunks.length})
          </button>

          <button
            id="tab-kb-upload"
            className="btn-secondary"
            onClick={() => setActiveTab('upload')}
            style={{
              background: activeTab === 'upload' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              borderColor: activeTab === 'upload' ? 'var(--accent-emerald)' : 'transparent',
              color: activeTab === 'upload' ? '#34d399' : 'var(--text-secondary)',
              fontSize: '0.85rem'
            }}
          >
            <UploadCloud size={14} /> Ingestion Form
          </button>
        </div>

        {activeTab !== 'upload' && (
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search knowledge base..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
            />
          </div>
        )}
      </div>

      {/* TAB 1: Documents List */}
      {activeTab === 'documents' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="glass-panel glass-card-interactive" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span className="badge-emerald">{doc.category}</span>
                  <span className="badge-cyan" style={{ fontSize: '0.7rem' }}>{doc.department}</span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {doc.title}
                </h3>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {doc.content}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={14} color="#10b981" />
                  <span>{doc.chunkCount} Indexed Chunks</span>
                </div>

                <button
                  className="btn-secondary"
                  onClick={() => onDeleteDocument(doc.id)}
                  style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#f43f5e', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                >
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Vector Chunks Inspection */}
      {activeTab === 'chunks' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredChunks.slice(0, 15).map((chunk) => (
              <div key={chunk.id} style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-glass)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8' }}>{chunk.docTitle} (Chunk #{chunk.chunkIndex})</span>
                  <span className="badge-purple" style={{ fontSize: '0.7rem' }}>{chunk.category}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.6, marginBottom: '10px' }}>
                  "{chunk.content}"
                </p>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Vector ID: {chunk.id}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Ingestion Form */}
      {activeTab === 'upload' && (
        <div className="glass-panel" style={{ maxWidth: '750px', margin: '0 auto', padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <UploadCloud size={24} color="#10b981" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Ingest New Document into RAG Store</h3>
          </div>

          <form onSubmit={handleSubmitIngest} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Document Title:</label>
              <input
                id="input-doc-title"
                type="text"
                className="input-field"
                placeholder="e.g. Mechanical Engineering Program Guidelines 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Category:</label>
                <select
                  id="select-doc-category"
                  className="input-field"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Admissions">Admissions</option>
                  <option value="Academics">Academics</option>
                  <option value="Financials">Financials</option>
                  <option value="Campus Life">Campus Life</option>
                  <option value="Placements">Placements</option>
                  <option value="FAQs">FAQs</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Department:</label>
                <select
                  id="select-doc-department"
                  className="input-field"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="Administration">Administration</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Finance">Finance</option>
                  <option value="Student Affairs">Student Affairs</option>
                  <option value="Career Cell">Career Cell</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Document Text / Knowledge Content:</label>
              <textarea
                id="textarea-doc-content"
                className="input-field"
                rows={8}
                placeholder="Paste official policy text, course syllabus details, or fee guidelines here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <button id="btn-submit-ingest" type="submit" className="btn-primary" disabled={isSubmitting} style={{ marginTop: '10px', justifyContent: 'center' }}>
              {isSubmitting ? 'Ingesting & Vectorizing...' : 'Ingest & Re-Index Knowledge Base'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
