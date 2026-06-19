// components/TopNav.js
// Top navigation bar with Deploy button, live stats, and result/error modals.

import { useState } from 'react';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';
import { Play, CheckCircle2, XCircle, AlertCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const selector = (s) => ({ nodes: s.nodes, edges: s.edges });

export const TopNav = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${backendUrl}/pipelines/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          height: '56px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 10,
        }}
      >
        {/* Left: Logo + pipeline name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '7px',
                background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-violet))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={14} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              VectorShift
            </span>
          </div>
          <div style={{ width: 1, height: 20, background: 'var(--border-subtle)' }} />
          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Untitled Pipeline
          </div>
          <div
            style={{
              padding: '3px 8px',
              background: 'var(--state-success-bg)',
              borderRadius: '4px',
              fontSize: '11px',
              color: 'var(--state-success)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontWeight: 500,
            }}
          >
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--state-success)' }} />
            Draft
          </div>
        </div>

        {/* Right: Stats + Deploy */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Live stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
            <span>
              <strong style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{nodes.length}</strong> nodes
            </span>
            <span>
              <strong style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{edges.length}</strong> edges
            </span>
          </div>

          <div style={{ width: 1, height: 24, background: 'var(--border-subtle)' }} />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className={loading ? 'loading-shimmer' : ''}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              background: loading
                ? 'var(--accent-blue)'
                : 'linear-gradient(135deg, var(--accent-blue), #6366f1)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.85 : 1,
              fontFamily: 'inherit',
              letterSpacing: '0.01em',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
              transition: 'opacity 0.15s, box-shadow 0.15s',
            }}
          >
            <Play size={14} fill="currentColor" />
            {loading ? 'Deploying...' : 'Deploy'}
          </motion.button>
        </div>
      </div>

      {/* ─── Result Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              backdropFilter: 'blur(6px)',
            }}
            onClick={() => setResult(null)}
          >
            <motion.div
              initial={{ scale: 0.93, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 24 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '28px',
                width: '380px',
                boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    background: result.is_dag
                      ? 'var(--state-success-bg)'
                      : 'var(--state-error-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: result.is_dag ? 'var(--state-success)' : 'var(--state-error)',
                  }}
                >
                  {result.is_dag ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Pipeline Analysis
                  </h2>
                  <p style={{ margin: '3px 0 0', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                    Parsing complete
                  </p>
                </div>
              </div>

              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{ padding: '16px', background: 'var(--bg-app)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px', fontVariantNumeric: 'tabular-nums' }}>
                    {result.num_nodes}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>Nodes</div>
                </div>
                <div style={{ padding: '16px', background: 'var(--bg-app)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px', fontVariantNumeric: 'tabular-nums' }}>
                    {result.num_edges}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>Edges</div>
                </div>
              </div>

              {/* DAG status */}
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  background: result.is_dag ? 'var(--state-success-bg)' : 'var(--state-error-bg)',
                  border: `1px solid ${result.is_dag ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)'}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginBottom: '20px',
                }}
              >
                {result.is_dag ? (
                  <CheckCircle2 color="var(--state-success)" size={18} style={{ marginTop: 1, flexShrink: 0 }} />
                ) : (
                  <XCircle color="var(--state-error)" size={18} style={{ marginTop: 1, flexShrink: 0 }} />
                )}
                <div>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: result.is_dag ? 'var(--state-success)' : 'var(--state-error)',
                      marginBottom: '3px',
                    }}
                  >
                    {result.is_dag ? 'Valid DAG — Pipeline Ready' : 'Cycle Detected'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {result.is_dag
                      ? 'This pipeline forms a valid Directed Acyclic Graph and can be deployed.'
                      : 'A circular dependency was found. Remove the cycle to deploy.'}
                  </div>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setResult(null)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.target.style.background = 'var(--bg-surface)')}
                onMouseLeave={(e) => (e.target.style.background = 'var(--bg-app)')}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* ─── Error Modal ───────────────────────────────────────────── */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              backdropFilter: 'blur(6px)',
            }}
            onClick={() => setError(null)}
          >
            <motion.div
              initial={{ scale: 0.93, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 24 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid rgba(244, 63, 94, 0.15)',
                borderRadius: '16px',
                padding: '28px',
                width: '380px',
                boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    background: 'var(--state-error-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--state-error)',
                  }}
                >
                  <AlertCircle size={22} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Connection Failed
                  </h2>
                </div>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
                {error}. Make sure the backend server is running and accessible.
              </div>
              <button
                onClick={() => setError(null)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.target.style.background = 'var(--bg-surface)')}
                onMouseLeave={(e) => (e.target.style.background = 'var(--bg-app)')}
              >
                Dismiss
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
