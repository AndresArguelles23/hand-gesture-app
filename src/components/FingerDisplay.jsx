import React from 'react'

const FINGER_NAMES = ['👍', '☝️', '✌️', '💍', '🤙']

export default function FingerDisplay({ label, count, fingers, color }) {
  const isEmpty = count === null

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 10, padding: '14px 18px',
      background: 'var(--bg3)',
      border: `0.5px solid ${isEmpty ? 'var(--border)' : color === 'left' ? '#00ccff44' : '#00ff8844'}`,
      borderRadius: 'var(--radius-lg)',
      minWidth: 110,
      transition: 'border-color 0.3s'
    }}>
      <div style={{
        fontFamily: 'var(--mono)',
        fontSize: 11,
        color: isEmpty ? 'var(--muted)' : color === 'left' ? 'var(--accent2)' : 'var(--accent)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase'
      }}>
        {label}
      </div>

      {/* Finger indicators */}
      <div style={{ display: 'flex', gap: 5, alignItems: 'flex-end' }}>
        {[0,1,2,3,4].map(i => {
          const up = fingers?.[i] ?? false
          return (
            <div key={i} style={{
              width: i === 0 ? 14 : 10,
              height: i === 0 ? 22 : [28, 34, 32, 28, 24][i],
              borderRadius: 4,
              background: up
                ? (color === 'left' ? 'var(--accent2)' : 'var(--accent)')
                : 'var(--surface)',
              border: `0.5px solid ${up
                ? (color === 'left' ? '#00ccff' : '#00ff88')
                : 'var(--border)'}`,
              transition: 'all 0.15s ease',
              transform: up ? 'translateY(-4px)' : 'none',
              boxShadow: up
                ? `0 0 8px ${color === 'left' ? '#00ccff66' : '#00ff8866'}`
                : 'none'
            }} />
          )
        })}
      </div>

      {/* Count */}
      <div style={{
        fontFamily: 'var(--mono)',
        fontSize: 28,
        fontWeight: 700,
        color: isEmpty ? 'var(--dim)' : color === 'left' ? 'var(--accent2)' : 'var(--accent)',
        lineHeight: 1,
        animation: !isEmpty ? 'count-pop 0.2s ease' : 'none',
        textShadow: !isEmpty
          ? `0 0 12px ${color === 'left' ? '#00ccff55' : '#00ff8855'}`
          : 'none'
      }}>
        {isEmpty ? '–' : count}
      </div>
    </div>
  )
}
