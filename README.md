# Hand Gesture Recognition

Sistema de reconocimiento de gestos en tiempo real usando MediaPipe Hands + React + Vite.

## Características

- Detección de hasta 2 manos simultáneas
- Conteo de dedos levantados (0–10)
- Reconocimiento de gestos: fist, open hand, peace, thumbs up, pointing, ok, rock on
- Overlay de landmarks (21 puntos por mano)
- Historial de gestos detectados
- ≥24 FPS en tiempo real con aceleración WebGL

## Requisitos

- Node.js 18 o superior (`node --version` para verificar)
- npm 9+ o pnpm
- Navegador moderno con soporte WebRTC (Chrome recomendado)
- Webcam conectada

## Instalación

```bash
# 1. Clona o descarga el proyecto
cd hand-gesture-app

# 2. Instala dependencias
npm install

# 3. Inicia el servidor de desarrollo
npm run dev

# 4. Abre en tu navegador
# http://localhost:3000
```

## Uso

1. Haz clic en **START CAMERA** en la interfaz
2. Permite el acceso a la cámara cuando el navegador lo solicite
3. Coloca tu(s) mano(s) frente a la cámara
4. El sistema detecta automáticamente los dedos levantados y el gesto

## Gestos soportados

| Gesto        | Descripción                       |
|--------------|-----------------------------------|
| ✊ fist       | Todos los dedos cerrados          |
| 🖐 open hand  | Los 5 dedos abiertos              |
| ✌️ peace      | Índice y medio levantados         |
| 👍 thumbs up  | Solo el pulgar levantado          |
| ☝️ pointing   | Solo el índice levantado          |
| 👌 ok         | Pulgar e índice levantados        |
| 🤘 rock on    | Índice y meñique levantados       |

## Build para producción

```bash
npm run build
# Los archivos se generan en /dist
# Despliega con: vercel deploy / netlify deploy
```

## Estructura del proyecto

```
src/
├── components/
│   ├── CameraView.jsx     — Video + canvas overlay
│   ├── FingerDisplay.jsx  — Indicadores visuales de dedos
│   ├── GestureHUD.jsx     — Panel principal de conteo
│   ├── GestureLog.jsx     — Historial de gestos
│   └── StatusBadge.jsx    — Indicador de estado LIVE/OFFLINE
├── hooks/
│   └── useHandGesture.js  — Lógica principal MediaPipe
├── styles/
│   └── global.css
├── App.jsx
└── main.jsx
```

## Notas técnicas

- MediaPipe se carga desde CDN de jsDelivr (no necesita backend)
- Los landmarks se normalizan relativos a la muñeca para ser invariantes a posición
- La lógica del pulgar usa el eje X y se invierte según la mano (izquierda/derecha)
- Para los dedos 2–5: `tip.y < pip.y` → dedo levantado (eje Y invertido en imagen)
