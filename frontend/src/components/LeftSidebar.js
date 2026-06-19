// components/LeftSidebar.js
// Sidebar with draggable node components, auto-generated from nodeRegistry.
// Grouped by category with search filtering.

import { useState, useMemo } from 'react';
import { getSidebarItems } from '../nodes/nodeRegistry';
import { Search, Blocks, ChevronLeft, ChevronRight } from 'lucide-react';

export const LeftSidebar = () => {
  const [search, setSearch] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const categories = useMemo(() => getSidebarItems(), []);

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((n) => n.label.toLowerCase().includes(q)),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [search, categories]);

  return (
    <div style={{ position: 'relative', height: 'calc(100vh - 56px)', zIndex: 10 }}>
      {/* Animated Container */}
      <div
        style={{
          width: isCollapsed ? '68px' : '260px',
          height: '100%',
          overflow: 'hidden',
          transition: 'width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Search */}
        <div style={{ padding: isCollapsed ? '16px 14px 8px' : '16px 14px 8px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: isCollapsed ? 'transparent' : 'var(--bg-app)',
            border: isCollapsed ? '1px solid transparent' : '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '8px',
            paddingLeft: isCollapsed ? '12px' : '12px',
            transition: 'all 0.15s',
            cursor: isCollapsed ? 'pointer' : 'text',
          }}
          onClick={() => { if(isCollapsed) setIsCollapsed(false); }}
          title={isCollapsed ? "Search nodes" : ""}
        >
          <Search size={16} color={isCollapsed ? "var(--text-secondary)" : "var(--text-tertiary)"} style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontFamily: 'inherit',
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : '100%',
              padding: 0,
              pointerEvents: isCollapsed ? 'none' : 'auto',
              transition: 'opacity 0.2s',
            }}
          />
        </div>
      </div>

      {/* Node list by category */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: isCollapsed ? '8px 0 16px' : '8px 14px 16px' }}>
        {filtered.map((cat) => (
          <div key={cat.category} style={{ marginBottom: '16px' }}>
            <div
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '8px',
                padding: isCollapsed ? '0' : '0 2px',
                textAlign: isCollapsed ? 'center' : 'left',
                opacity: isCollapsed ? 0 : 1,
                height: isCollapsed ? 0 : 'auto',
                overflow: 'hidden',
                transition: 'opacity 0.2s, height 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {cat.label}
            </div>
            {isCollapsed && <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0 16px 8px', opacity: 0.5 }} />}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {cat.items.map((n) => {
                const IconComponent = n.icon;
                return (
                  <div
                    key={n.type}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData(
                        'application/reactflow',
                        JSON.stringify({ nodeType: n.type })
                      );
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: isCollapsed ? '9px 0' : '9px 12px',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      background: 'transparent',
                      border: '1px solid transparent',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'grab',
                      color: 'var(--text-secondary)',
                      transition: 'all 0.15s ease',
                      userSelect: 'none',
                    }}
                    title={isCollapsed ? n.label : undefined}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 26,
                        height: 26,
                        borderRadius: '6px',
                        background: `color-mix(in srgb, ${n.color} 10%, transparent)`,
                        color: n.color,
                        flexShrink: 0,
                      }}
                    >
                      <IconComponent size={14} />
                    </div>
                    <span 
                      style={{ 
                        fontSize: '13px', 
                        fontWeight: 500, 
                        whiteSpace: 'nowrap',
                        opacity: isCollapsed ? 0 : 1,
                        width: isCollapsed ? 0 : 'auto',
                        overflow: 'hidden',
                        transition: 'opacity 0.2s',
                      }}
                    >
                      {n.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              color: 'var(--text-tertiary)',
              fontSize: '12px',
              padding: '24px 0',
            }}
          >
            No nodes match "{search}"
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: isCollapsed ? '14px 0' : '14px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--text-tertiary)',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            width: '100%',
          }}
        >
          <Blocks size={16} style={{ flexShrink: 0 }} />
          <span 
            style={{ 
              fontSize: '11px', 
              fontWeight: 500, 
              whiteSpace: 'nowrap',
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : 'auto',
              overflow: 'hidden',
              transition: 'opacity 0.2s',
            }}
          >
            VectorShift
          </span>
        </div>
      </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          position: 'absolute',
          right: '-14px',
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
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </div>
  );
};
