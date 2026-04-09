import { useEffect, useRef, useState, useCallback } from 'react'

const MEDIAPIPE_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands.js'

function loadMediaPipe() {
  return new Promise((resolve, reject) => {
    if (window.Hands) { resolve(window.Hands); return }
    const script = document.createElement('script')
    script.src = MEDIAPIPE_CDN
    script.crossOrigin = 'anonymous'
    script.onload = () => window.Hands ? resolve(window.Hands) : reject(new Error('Hands not on window'))
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const FINGER_TIPS = [4, 8, 12, 16, 20]
const FINGER_PIPS = [3, 6, 10, 14, 18]

/*
  COORDINATE STRATEGY — read before touching this file
  ─────────────────────────────────────────────────────
  MediaPipe gives x in [0,1] where 0=LEFT edge of the RAW camera frame.
  We want to show a mirrored image (like a selfie camera).

  Chosen approach: flip the video draw call inside the canvas using
  ctx.scale(-1,1) + ctx.translate(-W,0), then restore() BEFORE drawing
  landmarks so the transform is gone. Landmarks are drawn with the
  x-coordinate manually flipped:  screenX = (1 - lm.x) * W

  This means:
    lm.x=0.1 (left edge of raw frame)  → screenX = 0.9*W (right on screen) ✓
    lm.x=0.9 (right edge of raw frame) → screenX = 0.1*W (left on screen)  ✓

  The canvas element has NO CSS transform. The <video> element is hidden.
*/

function countFingers(landmarks, label) {
  if (!landmarks || landmarks.length < 21) return { count: 0, fingers: [] }
  let count = 0
  const fingers = []

  // Thumb uses x-axis in raw camera space (before mirror)
  // Right hand: when raised, tip.x < ip.x (tip moves toward body center in raw frame)
  // Left  hand: when raised, tip.x > ip.x
  const thumbRaised = label === 'Right'
    ? landmarks[4].x < landmarks[3].x
    : landmarks[4].x > landmarks[3].x
  fingers.push(thumbRaised)
  if (thumbRaised) count++

  for (let i = 1; i < 5; i++) {
    const raised = landmarks[FINGER_TIPS[i]].y < landmarks[FINGER_PIPS[i]].y
    fingers.push(raised)
    if (raised) count++
  }

  return { count, fingers }
}

function classifyGesture(leftResult, rightResult) {
  const r = rightResult || leftResult
  if (!r) return null
  const { count, fingers } = r
  if (count === 0) return 'fist ✊'
  if (count === 5) return 'open hand 🖐'
  if (fingers[1] && fingers[2] && !fingers[0] && !fingers[3] && !fingers[4]) return 'peace ✌️'
  if (fingers[0] && !fingers[1] && !fingers[2] && !fingers[3] && !fingers[4]) return 'thumbs up 👍'
  if (!fingers[0] && fingers[1] && !fingers[2] && !fingers[3] && !fingers[4]) return 'pointing ☝️'
  if (fingers[0] && fingers[1] && !fingers[2] && !fingers[3] && !fingers[4]) return 'ok 👌'
  if (!fingers[0] && fingers[1] && !fingers[2] && !fingers[3] && fingers[4]) return 'rock on 🤘'
  return `${count} finger${count !== 1 ? 's' : ''}`
}

export function useHandGesture(videoRef, canvasRef) {
  const [status, setStatus] = useState('idle')
  const [gestureData, setGestureData] = useState(null)
  const handsRef  = useRef(null)
  const cameraRef = useRef(null)
  const activeRef = useRef(false)

  const drawLandmarks = useCallback((ctx, landmarks, label) => {
    const W = ctx.canvas.width
    const H = ctx.canvas.height

    // x is manually flipped to match the mirrored video frame
    const sx = (x) => (1 - x) * W
    const sy = (y) => y * H

    const connections = [
      [0,1],[1,2],[2,3],[3,4],
      [0,5],[5,6],[6,7],[7,8],
      [0,9],[9,10],[10,11],[11,12],
      [0,13],[13,14],[14,15],[15,16],
      [0,17],[17,18],[18,19],[19,20],
      [5,9],[9,13],[13,17]
    ]

    ctx.strokeStyle = label === 'Left' ? 'rgba(0,204,255,0.7)' : 'rgba(0,255,136,0.7)'
    ctx.lineWidth = 1.5
    connections.forEach(([a, b]) => {
      ctx.beginPath()
      ctx.moveTo(sx(landmarks[a].x), sy(landmarks[a].y))
      ctx.lineTo(sx(landmarks[b].x), sy(landmarks[b].y))
      ctx.stroke()
    })

    const tipColor = label === 'Left' ? '#00ccff' : '#00ff88'
    FINGER_TIPS.forEach(idx => {
      ctx.beginPath()
      ctx.arc(sx(landmarks[idx].x), sy(landmarks[idx].y), 5, 0, Math.PI * 2)
      ctx.fillStyle = tipColor
      ctx.fill()
    })

    ctx.beginPath()
    ctx.arc(sx(landmarks[0].x), sy(landmarks[0].y), 4, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff88'
    ctx.fill()
  }, [])

  const onResults = useCallback((results) => {
    const canvas = canvasRef.current
    const video  = videoRef.current
    if (!canvas || !video) return

    // Sync canvas pixel dimensions to actual video resolution every frame.
    // Assigning width/height also clears the canvas automatically.
    const W = video.videoWidth  || 640
    const H = video.videoHeight || 480
    canvas.width  = W
    canvas.height = H

    const ctx = canvas.getContext('2d')

    // 1. Draw video mirrored (flip around vertical axis)
    ctx.save()
    ctx.scale(-1, 1)
    ctx.translate(-W, 0)
    ctx.drawImage(results.image, 0, 0, W, H)
    ctx.restore()
    // Transform is gone after restore() — draw landmarks in normal space below

    // 2. Draw landmarks with manually flipped x
    let leftResult  = null
    let rightResult = null

    if (results.multiHandLandmarks?.length > 0) {
      results.multiHandLandmarks.forEach((landmarks, i) => {
        const label = results.multiHandedness?.[i]?.label ?? 'Right'
        drawLandmarks(ctx, landmarks, label)
        const result = countFingers(landmarks, label)
        if (label === 'Left')  leftResult  = result
        if (label === 'Right') rightResult = result
      })
    }

    const total = (leftResult?.count ?? 0) + (rightResult?.count ?? 0)
    setGestureData({
      left:         leftResult?.count   ?? null,
      right:        rightResult?.count  ?? null,
      leftFingers:  leftResult?.fingers ?? [],
      rightFingers: rightResult?.fingers ?? [],
      total,
      gesture:      classifyGesture(leftResult, rightResult),
      handsDetected: results.multiHandLandmarks?.length ?? 0,
    })
  }, [canvasRef, videoRef, drawLandmarks])

  const start = useCallback(async () => {
    if (activeRef.current) return
    setStatus('loading')
    try {
      const HandsClass = await loadMediaPipe()
      const hands = new HandsClass({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`
      })
      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.6
      })
      hands.onResults(onResults)
      handsRef.current = hands

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, frameRate: { ideal: 30 } }
      })
      const video = videoRef.current
      video.srcObject = stream
      await video.play()

      activeRef.current = true
      setStatus('active')

      let rafId
      const loop = async () => {
        if (!activeRef.current) return
        if (video.readyState >= 2) await hands.send({ image: video })
        rafId = requestAnimationFrame(loop)
      }
      rafId = requestAnimationFrame(loop)
      cameraRef.current = { stop: () => cancelAnimationFrame(rafId) }

    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }, [videoRef, onResults])

  const stop = useCallback(() => {
    cameraRef.current?.stop()
    videoRef.current?.srcObject?.getTracks().forEach(t => t.stop())
    if (videoRef.current) videoRef.current.srcObject = null
    activeRef.current = false
    setStatus('idle')
    setGestureData(null)
  }, [videoRef])

  useEffect(() => () => stop(), [stop])

  return { status, gestureData, start, stop }
}
