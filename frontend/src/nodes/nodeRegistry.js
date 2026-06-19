// nodes/nodeRegistry.js
// ═══════════════════════════════════════════════════════════════════════
// Central registry for ALL node types.
// Each node is defined as a declarative config object.
// The `createNode()` factory turns configs into React components.
// Adding a new node = adding ~5 lines of config. Zero boilerplate.
// ═══════════════════════════════════════════════════════════════════════

import { BaseNode } from './BaseNode';
import {
  ArrowRightCircle,
  ArrowLeftCircle,
  Sparkles,
  FileText,
  Globe,
  Filter,
  Wrench,
  GitMerge,
  StickyNote,
  Timer,
  GitBranch,
  Database,
  Webhook,
  Calculator,
} from 'lucide-react';

// ─── createNode Factory ─────────────────────────────────────────────────
// Takes a config and returns a memoized React component.

export const createNode = (config) => {
  const NodeComponent = ({ id, data, selected }) => (
    <BaseNode
      id={id}
      title={config.title}
      icon={config.icon}
      accentColor={config.accentColor}
      inputs={config.inputs || []}
      outputs={config.outputs || []}
      fields={config.fields || []}
      data={data || {}}
      selected={selected}
      minWidth={config.minWidth}
      style={config.style}
    />
  );
  NodeComponent.displayName = `${config.title.replace(/\s+/g, '')}Node`;
  return NodeComponent;
};

// ─── Node Configurations ────────────────────────────────────────────────
// Each config fully describes a node: appearance, handles, and form fields.

export const NODE_CONFIGS = {
  // ── Core Nodes ──────────────────────────────────────────────────────
  customInput: {
    title: 'Input',
    icon: ArrowRightCircle,
    accentColor: 'var(--accent-cyan)',
    category: 'io',
    inputs: [],
    outputs: [{ id: 'value', label: 'value' }],
    fields: [
      { key: 'inputName', label: 'Name', type: 'text', placeholder: 'input_name' },
      {
        key: 'inputType',
        label: 'Type',
        type: 'select',
        default: 'Text',
        options: ['Text', 'File', 'Image', 'Audio'],
      },
    ],
  },

  customOutput: {
    title: 'Output',
    icon: ArrowLeftCircle,
    accentColor: 'var(--accent-emerald)',
    category: 'io',
    inputs: [{ id: 'value', label: 'value' }],
    outputs: [],
    fields: [
      { key: 'outputName', label: 'Name', type: 'text', placeholder: 'output_name' },
      {
        key: 'outputType',
        label: 'Type',
        type: 'select',
        default: 'Text',
        options: ['Text', 'File', 'Image', 'Audio'],
      },
    ],
  },

  llm: {
    title: 'LLM',
    icon: Sparkles,
    accentColor: 'var(--accent-violet)',
    category: 'processing',
    inputs: [
      { id: 'system', label: 'system' },
      { id: 'prompt', label: 'prompt' },
    ],
    outputs: [{ id: 'response', label: 'response' }],
    fields: [
      {
        key: 'model',
        label: 'Model',
        type: 'select',
        default: 'gpt-4o',
        options: [
          { value: 'gpt-4o', label: 'GPT-4o' },
          { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
          { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet' },
          { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
        ],
      },
      {
        key: 'temperature',
        label: 'Temperature',
        type: 'slider',
        min: 0,
        max: 2,
        step: 0.1,
        default: 0.7,
      },
    ],
  },

  api: {
    title: 'API Call',
    icon: Globe,
    accentColor: 'var(--accent-blue)',
    category: 'processing',
    inputs: [
      { id: 'body', label: 'body' },
      { id: 'headers', label: 'headers' },
    ],
    outputs: [
      { id: 'response', label: 'response' },
      { id: 'status', label: 'status' },
    ],
    fields: [
      {
        key: 'method',
        label: 'Method',
        type: 'select',
        default: 'GET',
        options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      },
      { key: 'url', label: 'URL', type: 'text', placeholder: 'https://api.example.com/endpoint' },
    ],
  },

  filter: {
    title: 'Filter',
    icon: Filter,
    accentColor: 'var(--accent-rose)',
    category: 'logic',
    inputs: [{ id: 'input', label: 'input' }],
    outputs: [
      { id: 'true', label: 'true' },
      { id: 'false', label: 'false' },
    ],
    fields: [
      {
        key: 'operator',
        label: 'Operator',
        type: 'select',
        default: 'contains',
        options: ['contains', 'equals', 'startsWith', 'endsWith', 'matches', 'greaterThan', 'lessThan'],
      },
      { key: 'condition', label: 'Value', type: 'text', placeholder: 'filter value...' },
    ],
  },

  transform: {
    title: 'Transform',
    icon: Wrench,
    accentColor: 'var(--accent-violet)',
    category: 'processing',
    inputs: [{ id: 'input', label: 'input' }],
    outputs: [{ id: 'output', label: 'output' }],
    fields: [
      {
        key: 'language',
        label: 'Language',
        type: 'select',
        default: 'javascript',
        options: ['javascript', 'python', 'json'],
      },
      { key: 'code', label: 'Code', type: 'code', default: '// transform(input)', placeholder: '// write code...' },
    ],
  },

  merge: {
    title: 'Merge',
    icon: GitMerge,
    accentColor: 'var(--accent-emerald)',
    category: 'processing',
    inputs: [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
      { id: 'c', label: 'C' },
    ],
    outputs: [{ id: 'merged', label: 'merged' }],
    fields: [
      {
        key: 'strategy',
        label: 'Strategy',
        type: 'select',
        default: 'concat',
        options: ['concat', 'zip', 'interleave', 'merge-by-key'],
      },
    ],
  },

  note: {
    title: 'Note',
    icon: StickyNote,
    accentColor: 'var(--accent-amber)',
    category: 'utility',
    inputs: [],
    outputs: [],
    fields: [
      { key: 'note', label: '', type: 'textarea', default: '', placeholder: 'Write a note...' },
    ],
    style: { opacity: 0.95 },
  },

  // ── 5 New Showcase Nodes ────────────────────────────────────────────
  // These demonstrate how easy it is to create new nodes with the config system.

  timer: {
    title: 'Timer',
    icon: Timer,
    accentColor: 'var(--accent-cyan)',
    category: 'utility',
    inputs: [{ id: 'trigger', label: 'trigger' }],
    outputs: [{ id: 'tick', label: 'tick' }],
    fields: [
      { key: 'interval', label: 'Interval (ms)', type: 'text', default: '1000', placeholder: '1000' },
      {
        key: 'mode',
        label: 'Mode',
        type: 'select',
        default: 'interval',
        options: [
          { value: 'interval', label: 'Interval' },
          { value: 'timeout', label: 'Timeout' },
          { value: 'cron', label: 'Cron Expression' },
        ],
      },
    ],
  },

  condition: {
    title: 'Condition',
    icon: GitBranch,
    accentColor: 'var(--accent-amber)',
    category: 'logic',
    inputs: [{ id: 'input', label: 'input' }],
    outputs: [
      { id: 'then', label: 'then' },
      { id: 'else', label: 'else' },
    ],
    fields: [
      {
        key: 'expression',
        label: 'Expression',
        type: 'code',
        default: 'input.length > 0',
        placeholder: 'Boolean expression...',
      },
    ],
  },

  database: {
    title: 'Database',
    icon: Database,
    accentColor: '#6366f1',
    category: 'processing',
    inputs: [{ id: 'params', label: 'params' }],
    outputs: [
      { id: 'rows', label: 'rows' },
      { id: 'count', label: 'count' },
    ],
    fields: [
      {
        key: 'engine',
        label: 'Engine',
        type: 'select',
        default: 'postgresql',
        options: [
          { value: 'postgresql', label: 'PostgreSQL' },
          { value: 'mysql', label: 'MySQL' },
          { value: 'sqlite', label: 'SQLite' },
          { value: 'mongodb', label: 'MongoDB' },
        ],
      },
      { key: 'query', label: 'Query', type: 'code', default: 'SELECT * FROM users', placeholder: 'SQL query...' },
    ],
  },

  webhook: {
    title: 'Webhook',
    icon: Webhook,
    accentColor: '#ec4899',
    category: 'io',
    inputs: [],
    outputs: [
      { id: 'payload', label: 'payload' },
      { id: 'headers', label: 'headers' },
    ],
    fields: [
      {
        key: 'method',
        label: 'Listen For',
        type: 'select',
        default: 'POST',
        options: ['POST', 'GET', 'PUT', 'ANY'],
      },
      { key: 'path', label: 'Endpoint Path', type: 'text', default: '/webhook', placeholder: '/webhook/events' },
    ],
  },

  math: {
    title: 'Math',
    icon: Calculator,
    accentColor: '#14b8a6',
    category: 'processing',
    inputs: [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ],
    outputs: [{ id: 'result', label: 'result' }],
    fields: [
      {
        key: 'operation',
        label: 'Operation',
        type: 'select',
        default: 'add',
        options: [
          { value: 'add', label: 'Add (+)' },
          { value: 'subtract', label: 'Subtract (−)' },
          { value: 'multiply', label: 'Multiply (×)' },
          { value: 'divide', label: 'Divide (÷)' },
          { value: 'modulo', label: 'Modulo (%)' },
          { value: 'power', label: 'Power (^)' },
        ],
      },
      {
        key: 'precision',
        label: 'Decimal Precision',
        type: 'slider',
        min: 0,
        max: 10,
        step: 1,
        default: 2,
      },
    ],
  },
};

// ─── Category metadata ──────────────────────────────────────────────────

export const CATEGORIES = {
  io: { label: 'Input / Output', order: 0 },
  processing: { label: 'Processing', order: 1 },
  logic: { label: 'Logic', order: 2 },
  utility: { label: 'Utility', order: 3 },
};

// ─── Generate all node components ───────────────────────────────────────
// Text node is imported separately because of its unique dynamic-handle behavior.

const generatedNodeTypes = {};
Object.entries(NODE_CONFIGS).forEach(([type, config]) => {
  generatedNodeTypes[type] = createNode(config);
});

export { generatedNodeTypes };

// ─── Sidebar config (grouped by category) ───────────────────────────────

export const getSidebarItems = () => {
  const grouped = {};
  Object.entries(NODE_CONFIGS).forEach(([type, config]) => {
    const cat = config.category || 'utility';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push({
      type,
      label: config.title,
      color: config.accentColor,
      icon: config.icon,
    });
  });

  // Add text node manually (it's not in NODE_CONFIGS because it's a special component)
  if (!grouped.processing) grouped.processing = [];
  grouped.processing.unshift({
    type: 'text',
    label: 'Text',
    color: 'var(--accent-amber)',
    icon: FileText,
  });

  return Object.entries(CATEGORIES)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([key, meta]) => ({
      category: key,
      label: meta.label,
      items: grouped[key] || [],
    }));
};
