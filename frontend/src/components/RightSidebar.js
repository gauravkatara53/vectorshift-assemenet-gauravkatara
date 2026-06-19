// components/RightSidebar.js
// Inspector panel — auto-generates form fields from nodeRegistry configs.
// Shows correct icon + accent color for each selected node type.

import { useStore } from '../store';
import { shallow } from 'zustand/shallow';
import { NODE_CONFIGS } from '../nodes/nodeRegistry';
import { Settings, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import { useRef, useEffect, useCallback, useState } from 'react';

const selector = (s) => ({ nodes: s.nodes, updateNodeField: s.updateNodeField });

// ─── Auto‑resize textarea helper ────────────────────────────────────────
const AutoTextarea = ({ value, onChange, placeholder, style }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  }, [value]);
  return (
    <textarea
      ref={ref}
      style={{
        width: '100%',
        background: 'var(--bg-app)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '6px',
        padding: '8px 12px',
        fontSize: '13px',
        color: 'var(--text-primary)',
        outline: 'none',
        fontFamily: 'inherit',
        resize: 'none',
        overflow: 'hidden',
        lineHeight: 1.5,
        transition: 'border-color 0.15s, box-shadow 0.15s',
        ...style,
      }}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={(e) => {
        e.target.style.borderColor = 'var(--border-focus)';
        e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.12)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'var(--border-subtle)';
        e.target.style.boxShadow = 'none';
      }}
    />
  );
};

// ─── Field Styles ────────────────────────────────────────────────────────
const fieldStyle = {
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.04em',
    color: 'var(--text-secondary)',
    marginBottom: '6px',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    background: 'var(--bg-app)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '13px',
    color: 'var(--text-primary)',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  select: {
    width: '100%',
    background: 'var(--bg-app)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '13px',
    color: 'var(--text-primary)',
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'pointer',
    appearance: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  group: {
    marginBottom: '20px',
  },
};

// Focus handler for inputs
const focusHandlers = {
  onFocus: (e) => {
    e.target.style.borderColor = 'var(--border-focus)';
    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.12)';
  },
  onBlur: (e) => {
    e.target.style.borderColor = 'var(--border-subtle)';
    e.target.style.boxShadow = 'none';
  },
};

// ─── Inspector field renderers ──────────────────────────────────────────
const renderField = (field, data, handleChange) => {
  const value = data[field.key];

  switch (field.type) {
    case 'text':
      return (
        <input
          style={fieldStyle.input}
          type="text"
          value={value ?? field.default ?? ''}
          onChange={(e) => handleChange(field.key, e.target.value)}
          placeholder={field.placeholder || ''}
          {...focusHandlers}
        />
      );
    case 'textarea':
    case 'code':
      return (
        <AutoTextarea
          value={value ?? field.default ?? ''}
          onChange={(e) => handleChange(field.key, e.target.value)}
          placeholder={field.placeholder || ''}
          style={
            field.type === 'code'
              ? { fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '12px' }
              : {}
          }
        />
      );
    case 'select':
      return (
        <select
          style={fieldStyle.select}
          value={value ?? field.default ?? (field.options?.[0]?.value ?? field.options?.[0]) ?? ''}
          onChange={(e) => handleChange(field.key, e.target.value)}
          {...focusHandlers}
        >
          {(field.options || []).map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const label = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={val} value={val}>
                {label}
              </option>
            );
          })}
        </select>
      );
    case 'slider':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="range"
            min={field.min ?? 0}
            max={field.max ?? 100}
            step={field.step ?? 1}
            style={{ flex: 1, cursor: 'pointer' }}
            value={value ?? field.default ?? field.min ?? 0}
            onChange={(e) => handleChange(field.key, e.target.value)}
          />
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              minWidth: '28px',
              textAlign: 'right',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {value ?? field.default ?? field.min ?? 0}
          </span>
        </div>
      );
    default:
      return null;
  }
};

// ─── Text Node Inspector (special case) ─────────────────────────────────
const TextNodeSettings = ({ node, updateNodeField }) => {
  const handleChange = useCallback(
    (key, value) => updateNodeField(node.id, key, value),
    [node.id, updateNodeField]
  );

  return (
    <div style={fieldStyle.group}>
      <label style={fieldStyle.label}>Content</label>
      <AutoTextarea
        value={node.data?.text ?? '{{input}}'}
        onChange={(e) => handleChange('text', e.target.value)}
        placeholder="Enter text... Use {{variable}} for dynamic inputs"
        style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '12px', minHeight: '120px' }}
      />
      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '8px', lineHeight: 1.5 }}>
        Use <code style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--accent-amber)', padding: '1px 5px', borderRadius: '3px', fontSize: '10px' }}>{'{{variable}}'}</code> to create dynamic input handles.
      </div>
    </div>
  );
};

// ─── Dynamic Inspector based on node config ─────────────────────────────
const NodeSettings = ({ node, updateNodeField }) => {
  const config = NODE_CONFIGS[node.type];
  const handleChange = useCallback(
    (key, value) => updateNodeField(node.id, key, value),
    [node.id, updateNodeField]
  );

  // Text node uses special inspector
  if (node.type === 'text') {
    return <TextNodeSettings node={node} updateNodeField={updateNodeField} />;
  }

  // No config? Generic fallback
  if (!config || !config.fields || config.fields.length === 0) {
    return (
      <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
        No configuration available.
      </div>
    );
  }

  // Render all fields from config
  return (
    <>
      {config.fields.map((field) => (
        <div key={field.key} style={fieldStyle.group}>
          {field.label && <label style={fieldStyle.label}>{field.label}</label>}
          {renderField(field, node.data || {}, handleChange)}
        </div>
      ))}
    </>
  );
};

// ─── Main RightSidebar Component ────────────────────────────────────────
export const RightSidebar = () => {
  const { nodes, updateNodeField } = useStore(selector, shallow);
  const selectedNode = nodes.find((n) => n.selected);
  const [isCollapsed, setIsCollapsed] = useState(!selectedNode);

  useEffect(() => {
    setIsCollapsed(!selectedNode);
  }, [selectedNode]);

  // Get icon and color from registry
  const config = selectedNode ? NODE_CONFIGS[selectedNode.type] : null;
  const IconComponent = config?.icon || (selectedNode?.type === 'text' ? FileText : null);
  const accentColor = config?.accentColor || (selectedNode?.type === 'text' ? 'var(--accent-amber)' : 'var(--accent-blue)');
  const nodeTitle = config?.title || (selectedNode?.type === 'text' ? 'Text' : selectedNode?.type?.replace('custom', ''));

  return (
    <div style={{ position: 'relative', height: 'calc(100vh - 56px)', zIndex: 10 }}>
      {/* Animated Container */}
      <div
        style={{
          width: isCollapsed ? '0px' : '320px',
          height: '100%',
          overflow: 'hidden',
          transition: 'width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
          background: 'var(--bg-surface)',
          borderLeft: isCollapsed ? 'none' : '1px solid var(--border-subtle)',
        }}
      >
        {/* Fixed width inner content to prevent text reflow */}
        <div
          style={{
            width: '320px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            opacity: isCollapsed ? 0 : 1,
            transition: 'opacity 0.2s ease',
            pointerEvents: isCollapsed ? 'none' : 'auto',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Settings size={16} color="var(--text-secondary)" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Inspector
            </span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {selectedNode ? (
          <div>
            {/* Node header with icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  background: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: accentColor,
                }}
              >
                {IconComponent && <IconComponent size={18} />}
              </div>
              <div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  {nodeTitle} Node
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-tertiary)',
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    marginTop: '2px',
                  }}
                >
                  {selectedNode.id}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
              <NodeSettings node={selectedNode} updateNodeField={updateNodeField} />
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-tertiary)',
              textAlign: 'center',
              gap: '12px',
            }}
          >
            <Settings size={32} opacity={0.3} />
            <span style={{ fontSize: '13px' }}>Select a node to view its configuration.</span>
          </div>
        )}
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          position: 'absolute',
          left: '-14px',
          top: '24px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 50,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          color: 'var(--text-secondary)',
          padding: 0,
        }}
        title={isCollapsed ? "Expand Inspector" : "Collapse Inspector"}
      >
        {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
    </div>
  );
};
