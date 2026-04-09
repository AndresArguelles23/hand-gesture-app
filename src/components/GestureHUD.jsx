import React, { useEffect, useRef } from 'react'
import FingerDisplay from './FingerDisplay.jsx'

export default function GestureHUD({ gestureData }) {
  const prevGesture = useRef(null)

  const data = gestureData ?? {
    left: null, right: null,
    leftFingers: [], rightFingers: [],
    total: 0, gesture: null, handsDetected: 0
  }

  const gestureChanged = data.gesture !== prevGesture.current
  useEffect(() => { prevGesture.current = data.gesture }, [data.gesture])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 16,
      width: '100%'
    }}>

      {/* Hands row */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <FingerDisplay
          label="Left"
          count={data.left}
          fingers={data.leftFingers}
          color="left"
        />

        {/* Total */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 4, minWidth: 72
        }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10,
            color: 'var(--muted)', letterSpacing: '0.1em'
          }}>TOTAL</div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 48, fontWeight: 700,
            lineHeight: 1,
            color: data.handsDetected > 0 ? 'var(--text)' : 'var(--dim)',
            textShadow: data.handsDetected > 0 ? '0 0 20px rgba(255,255,255,0.15)' : 'none',
            transition: 'color 0.2s'
          }}>
            {data.handsDetected > 0 ? data.total : '–'}
          </div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10,
            color: 'var(--muted)'
          }}>
            {data.handsDetected === 0 ? 'no hands' :
             data.handsDetected === 1 ? '1 hand' : '2 hands'}
          </div>
        </div>

        <FingerDisplay
          label="Right"
          count={data.right}
          fingers={data.rightFingers}
          color="right"
        />
      </div>

      {/* Gesture label */}
      <div style={{
        textAlign: 'center', minHeight: 32,
        animation: gestureChanged && data.gesture ? 'slide-up 0.25s ease' : 'none'
      }}>
        {data.gesture ? (
          <span style={{
            fontFamily: 'var(--sans)',
            fontSize: 15, fontWeight: 500,
            color: 'var(--text)',
            background: 'var(--surface)',
            border: '0.5px solid var(--border2)',
            borderRadius: 20,
            padding: '4px 14px',
            display: 'inline-block'
          }}>
            {data.gesture}
          </span>
        ) : (
          <span style={{ color: 'var(--dim)', fontSize: 13 }}>
            — show your hands —
          </span>
        )}
      </div>
    </div>
  )
}
