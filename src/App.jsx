import React, { useRef } from 'react'
import { useHandGesture } from './hooks/useHandGesture.js'
import CameraView from './components/CameraView.jsx'
import GestureHUD from './components/GestureHUD.jsx'
import GestureLog from './components/GestureLog.jsx'
import StatusBadge from './components/StatusBadge.jsx'

export default function App() {
  const videoRef  = useRef(null)
  const canvasRef = useRef(null)

  const { status, gestureData, start, stop } = useHandGesture(videoRef, canvasRef)

  const isActive = status === 'active'

  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg)',
      overflow: 'hidden'
    }}>

      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px',
        borderBottom: '0.5px solid var(--border)',
        background: 'var(--bg)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Hand icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
          </svg>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 12,
            color: 'var(--text)', letterSpacing: '0.08em'
          }}>
            GESTURE RECOGNITION
          </span>
        </div>

        <StatusBadge status={status} />
      </header>

      {/* Main content */}
      <main style={{
        flex: 1, display: 'flex', gap: 0,
        overflow: 'hidden', minHeight: 0
      }}>

        {/* Left: Camera */}
        <div style={{
          flex: '1 1 0', display: 'flex', flexDirection: 'column',
          gap: 12, padding: '16px',
          borderRight: '0.5px solid var(--border)',
          overflow: 'hidden', minWidth: 0
        }}>
          <CameraView
            videoRef={videoRef}
            canvasRef={canvasRef}
            status={status}
          />

          {/* Controls */}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button
              onClick={isActive ? stop : start}
              disabled={status === 'loading'}
              style={{
                flex: 1,
                padding: '10px 16px',
                fontFamily: 'var(--mono)',
                fontSize: 11,
                letterSpacing: '0.1em',
                fontWeight: 700,
                border: `0.5px solid ${isActive ? '#ff444466' : 'var(--accent)44'}`,
                borderRadius: 'var(--radius)',
                background: isActive ? '#ff444411' : '#00ff8811',
                color: isActive ? '#ff6666' : 'var(--accent)',
                cursor: status === 'loading' ? 'wait' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {status === 'loading' ? 'LOADING...' : isActive ? 'STOP CAMERA' : 'START CAMERA'}
            </button>
          </div>

          {status === 'error' && (
            <div style={{
              padding: '10px 12px',
              background: '#ff444411',
              border: '0.5px solid #ff444444',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--mono)', fontSize: 11,
              color: '#ff6666', lineHeight: 1.5
            }}>
              ⚠ Camera access denied. Please allow webcam permission and reload.
            </div>
          )}
        </div>

        {/* Right: HUD + Log */}
        <div style={{
          width: 280, flexShrink: 0,
          display: 'flex', flexDirection: 'column',
          padding: '16px',
          gap: 16,
          overflow: 'hidden'
        }}>
          <GestureHUD gestureData={gestureData} />

          <div style={{ height: '0.5px', background: 'var(--border)', flexShrink: 0 }} />

          <GestureLog gestureData={gestureData} />

          {/* Footer info */}
          <div style={{
            marginTop: 'auto',
            paddingTop: 10,
            borderTop: '0.5px solid var(--border)',
            flexShrink: 0
          }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.6 }}>
              Powered by MediaPipe Hands<br/>
              Up to 2 hands · 21 landmarks each<br/>
              Rule-based finger counting
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
