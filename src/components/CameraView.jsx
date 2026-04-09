import React from 'react'

/*
  CameraView — important constraints:
  - The <canvas> must have NO CSS transform (no scaleX). The hook mirrors
    the video by flipping the draw call, and landmarks are manually flipped.
  - The <canvas> CSS dimensions (width/height 100%) scale the pixels visually,
    but canvas.width/height (set in the hook each frame) define the pixel buffer.
    These must stay in sync with the video resolution (640×480) to avoid stretch.
  - The <video> element is invisible (opacity:0). It only serves as the source
    for MediaPipe and for canvas.drawImage inside the hook.
*/
export default function CameraView({ videoRef, canvasRef, status, camMaxHeight }) {
  const active  = status === 'active'
  const loading = status === 'loading'

  return (
    <div style={{
      position: 'relative',
      height: camMaxHeight,
      width: 'auto',
      aspectRatio: '4 / 3',
      maxWidth: '100%',
      background: 'var(--bg2)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: `0.5px solid ${active ? '#00ff8822' : 'var(--border)'}`,
      transition: 'border-color 0.4s',
    }}>

      {/* Hidden video — source only */}
      <video
        ref={videoRef}
        style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, pointerEvents: 'none' }}
        muted playsInline
      />

      {/* Canvas — NO CSS transform here. Mirror is done inside the hook draw call. */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          display: active ? 'block' : 'none',
        }}
      />

      {!active && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'var(--muted)' }}>
          {loading ? (
            <>
              <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--border2)', borderTop: '2px solid var(--accent)', animation: 'spin 0.9s linear infinite' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.1em' }}>LOADING MODEL...</span>
            </>
          ) : (
            <>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.1em' }}>CAMERA OFF</span>
            </>
          )}
        </div>
      )}

      {active && (
        <div style={{ position: 'absolute', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.3), transparent)', animation: 'scan-line 3s linear infinite', pointerEvents: 'none' }} />
      )}

      {['top-left','top-right','bottom-left','bottom-right'].map(pos => {
        const [v, h] = pos.split('-')
        return (
          <div key={pos} style={{
            position: 'absolute', [v]: 8, [h]: 8, width: 16, height: 16,
            borderTop:    v === 'top'    ? `1px solid ${active ? 'var(--accent)' : 'var(--border2)'}` : 'none',
            borderBottom: v === 'bottom' ? `1px solid ${active ? 'var(--accent)' : 'var(--border2)'}` : 'none',
            borderLeft:   h === 'left'   ? `1px solid ${active ? 'var(--accent)' : 'var(--border2)'}` : 'none',
            borderRight:  h === 'right'  ? `1px solid ${active ? 'var(--accent)' : 'var(--border2)'}` : 'none',
            transition: 'border-color 0.4s', pointerEvents: 'none',
          }} />
        )
      })}
    </div>
  )
}
