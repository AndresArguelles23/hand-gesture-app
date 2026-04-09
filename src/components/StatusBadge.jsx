import React from 'react'

const STATUS_CONFIG = {
  idle:    { label: 'OFFLINE',    color: 'var(--muted)',   dot: '#444' },
  loading: { label: 'INIT...',    color: 'var(--warn)',    dot: 'var(--warn)',   blink: true },
  active:  { label: 'LIVE',       color: 'var(--accent)',  dot: 'var(--accent)', pulse: true },
  error:   { label: 'ERROR',      color: '#ff4444',        dot: '#ff4444' }
}

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.idle

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px',
      border: `0.5px solid ${cfg.color}33`,
      borderRadius: 20,
      background: `${cfg.color}11`
    }}>
      {/* Dot */}
      <div style={{ position: 'relative', width: 7, height: 7 }}>
        {cfg.pulse && (
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            background: cfg.dot,
            animation: 'pulse-ring 1.2s ease-out infinite'
          }} />
        )}
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: cfg.dot,
          animation: cfg.blink ? 'blink 0.8s ease-in-out infinite' : 'none'
        }} />
      </div>

      <span style={{
        fontFamily: 'var(--mono)',
        fontSize: 10,
        fontWeight: 700,
        color: cfg.color,
        letterSpacing: '0.12em'
      }}>
        {cfg.label}
      </span>
    </div>
  )
}
