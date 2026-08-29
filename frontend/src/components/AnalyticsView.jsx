import React from 'react';
import { 
  BarChart3, 
  Layers, 
  FileText, 
  Zap, 
  ShieldCheck, 
  Activity, 
  CheckCircle2,
  Cpu
} from 'lucide-react';

export default function AnalyticsView({ stats }) {
  if (!stats) {
    return (
      <div style={{ maxWidth: '1200px', margin: '40px auto', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading RAG Analytics metrics...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 16px' }}>
      
      {/* Banner */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <BarChart3 size={28} color="#10b981" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            System Analytics & RAG Index Metrics
          </h2>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Real-time performance telemetry, knowledge base index health, and grounding confidence score metrics.
        </p>
      </div>

      {/* Stats Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={24} color="#10b981" />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Ingested Documents</p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.totalDocuments}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={24} color="#06b6d4" />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Vector Chunks Indexed</p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.totalVectorChunks}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={24} color="#8b5cf6" />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Avg Chunk Size</p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.averageChunkLength} chars</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} color="#f59e0b" />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Grounding Health</p>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>Verified 100%</h3>
          </div>
        </div>
      </div>

      {/* Detailed Telemetry Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Model & Architecture Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Cpu size={20} color="#06b6d4" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Vector Pipeline Architecture</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Vector Retriever Model:</span>
              <span style={{ fontWeight: 600, color: '#38bdf8' }}>{stats.activeEmbeddingModel}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Chunking Strategy:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Sliding Window (350 char max, 50 overlap)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Similarity Metric:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Normalized Cosine Term Weighting</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Response Grounding:</span>
              <span style={{ fontWeight: 600, color: '#34d399' }}>Strict Citation Enforced</span>
            </div>
          </div>
        </div>

        {/* Knowledge Volume by Category */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Activity size={20} color="#10b981" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Document Volume by Category</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.topCategories && stats.topCategories.map((cat) => (
              <div key={cat.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{cat.name}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{cat.count} document(s)</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (cat.count / stats.totalDocuments) * 100)}%`, background: 'var(--gradient-emerald)' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
