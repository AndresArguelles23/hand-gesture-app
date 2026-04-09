import React, { useEffect, useRef, useState } from 'react'

const MAX_LOG = 40

export default function GestureLog({ gestureData }) {
  const [log, setLog] = useState([])
  const prevGesture = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    const g = gestureData?.gesture
    if (!g || g === prevGesture.current) return
    prevGesture.current = g
    setLog(prev => {
      const entry = { id: Date.now(), gesture: g, total: gestureData.total }
      return [entry, ...prev].slice(0, MAX_LOG)
    })
  }, [gestureData])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0
    }}>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 10,
        color: 'var(--muted)', letterSpacing: '0.1em',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span>GESTURE LOG</span>
        {log.length > 0 && (
          <button
            onClick={() => setLog([])}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--muted)', fontSize: 10, fontFamily: 'var(--mono)',
              padding: '2px 4px',
              borderRadius: 3,
              letterSpacing: '0.05em'
            }}
          >
            CLEAR
          </button>
        )}
      </div>

      <div ref={listRef} style={{
        flex: 1, overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 3,
        maxHeight: 160
      }}>
        {log.length === 0 ? (
          <div style={{ color: 'var(--dim)', fontSize: 12, padding: '8px 0' }}>
            No gestures yet…
          </div>
        ) : log.map((entry, i) => (
          <div key={entry.id} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '4px 8px',
            background: i === 0 ? 'var(--surface)' : 'transparent',
            border: `0.5px solid ${i === 0 ? 'var(--border2)' : 'transparent'}`,
            borderRadius: 4,
            animation: i === 0 ? 'slide-up 0.2s ease' : 'none',
            transition: 'background 0.3s'
          }}>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 10,
              color: 'var(--accent)', minWidth: 18, textAlign: 'right'
            }}>
              {entry.total}
            </span>
            <span style={{ fontSize: 12, color: i === 0 ? 'var(--text)' : 'var(--muted)' }}>
              {entry.gesture}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
