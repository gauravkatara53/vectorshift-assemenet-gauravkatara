// nodes/BaseNode.js
// Core abstraction — renders any node from a declarative config.
// On-canvas: compact preview with field values shown as read-only labels.
// Full editing happens in the RightSidebar inspector.

import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';
import { useState } from 'react';

// ─── Compact field previews (displayed on the node canvas) ──────────────
// These are read-only, minimal representations of each field's value.

const compactRenderers = {
  text: ({ field, value }) => (
    <div className="node-compact-row">
      <span className="node-compact-label">{field.label}</span>
      <span className="node-compact-value">{value || field.default || field.placeholder || '—'}</span>
    </div>
  ),

  textarea: ({ field, value }) => {
    const text = value || field.default || '';
    if (!text) return null;
    return (
      <div className="node-compact-code">
        {text.length > 60 ? text.slice(0, 60) + '…' : text}
      </div>
    );
  },

  select: ({ field, value }) => {
    const v = value || field.default || '';
    const opt = (field.options || []).find(
      (o) => (typeof o === 'string' ? o : o.value) === v
    );
    const display = opt ? (typeof opt === 'string' ? opt : opt.label) : v;
    return (
      <div className="node-compact-row">
        <span className="node-compact-label">{field.label}</span>
        <span className="node-compact-badge" style={{ '--badge-color': field.color || 'var(--accent-blue)' }}>
          {display}
        </span>
      </div>
    );
  },

  slider: ({ field, value }) => (
    <div className="node-compact-row">
      <span className="node-compact-label">{field.label}</span>
      <span className="node-compact-value">{value ?? field.default ?? field.min ?? 0}</span>
    </div>
  ),

  badge: ({ field, value }) => (
    <span className="node-compact-badge" style={{ '--badge-color': field.color || 'var(--accent-blue)' }}>
      {value ?? field.default ?? field.label}
    </span>
  ),

  code: ({ field, value }) => {
    const text = value || field.default || '';
    if (!text) return null;
    return (
      <div className="node-compact-code mono">
        {text.length > 50 ? text.slice(0, 50) + '…' : text}
      </div>
    );
  },

  display: ({ field, value }) => (
    <div className="node-compact-row">
      <span className="node-compact-value">{value ?? field.default ?? '—'}</span>
    </div>
  ),

  chips: ({ field, value }) => {
    const items = value ?? field.default ?? [];
    return (
      <div className="node-compact-chips">
        {(Array.isArray(items) ? items : [items]).map((item, i) => (
          <span key={i} className="node-compact-badge" style={{ '--badge-color': field.color || 'var(--accent-blue)' }}>
            {item}
          </span>
        ))}
      </div>
    );
  },
};

// ─── BaseNode Component ─────────────────────────────────────────────────

export const BaseNode = ({
  id,
  title,
  icon: Icon,
  accentColor = 'var(--accent-blue)',
  inputs = [],
  outputs = [],
  fields = [],
  data = {},
  children,
  style = {},
  selected = false,
  minWidth = 220,
}) => {
  const [hovered, setHovered] = useState(false);

  // Calculate handle positions
  const getHandleTop = (index, total) => {
    if (total === 1) return '50%';
    const start = 25;
    const end = 75;
    const pct = start + (index / (total - 1)) * (end - start);
    return `${pct}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`base-node ${selected ? 'selected' : ''} ${hovered ? 'hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        '--accent': accentColor,
        minWidth,
        ...style,
      }}
    >
      {/* Accent strip at top */}
      <div className="base-node-accent" style={{ background: accentColor }} />

      {/* Header */}
      <div className="base-node-header">
        <div className="base-node-icon" style={{ '--icon-color': accentColor }}>
          {Icon && <Icon size={15} strokeWidth={2.5} />}
        </div>
        <span className="base-node-title">{title}</span>
      </div>

      {/* Compact field previews */}
      {fields.length > 0 && (
        <div className="base-node-body">
          {fields.map((field) => {
            const Renderer = compactRenderers[field.type];
            if (!Renderer) return null;
            return (
              <div key={field.key}>
                <Renderer field={field} value={data[field.key]} />
              </div>
            );
          })}
        </div>
      )}

      {/* Custom children (for special nodes like Text) */}
      {children && <div className="base-node-body">{children}</div>}

      {/* Input Handles (left side) */}
      {inputs.map((handle, i) => (
        <div key={handle.id} className="base-node-handle-group left">
          <Handle
            type="target"
            position={Position.Left}
            id={handle.id}
            className="base-node-handle"
            style={{
              top: getHandleTop(i, inputs.length),
              '--handle-color': accentColor,
            }}
          />
          {handle.label && (
            <span
              className="base-node-handle-label left"
              style={{ top: getHandleTop(i, inputs.length) }}
            >
              {handle.label}
            </span>
          )}
        </div>
      ))}

      {/* Output Handles (right side) */}
      {outputs.map((handle, i) => (
        <div key={handle.id} className="base-node-handle-group right">
          <Handle
            type="source"
            position={Position.Right}
            id={handle.id}
            className="base-node-handle"
            style={{
              top: getHandleTop(i, outputs.length),
              '--handle-color': accentColor,
            }}
          />
          {handle.label && (
            <span
              className="base-node-handle-label right"
              style={{ top: getHandleTop(i, outputs.length) }}
            >
              {handle.label}
            </span>
          )}
        </div>
      ))}
    </motion.div>
  );
};
