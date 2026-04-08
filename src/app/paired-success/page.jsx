'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from "react";


export default function PairedSuccess() {
  const params = useSearchParams();
  const frameId = params.get('frame_id');

  const [showCloseMessage, setShowCloseMessage] = useState(null);
  const [backendBase, setBackendBase] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // WebSocket to send rotation deltas to the frame
  const wsRef = useRef(null);

  // Controller rotation + inertia state
  const [rotation, setRotation] = useState(0);
  const isDragging = useRef(false);
  const lastAngle = useRef(0);
  const lastTime = useRef(0);
  const velocity = useRef(0); // deg per ~frame
  const momentumRAF = useRef(null);

  // Disc DOM ref for robust center calc
  const discRef = useRef(null);

  // Disc sizing and rings (match SongCD look; no album art)
  const discSize = 300;
  const outerRingSize = discSize * 0.96;
  const centerHoleSize = discSize * 0.3;
  const dottedRingSize = discSize * 0.286;
  const innerRingSize = discSize * 0.254;
  const middleCircleSize = discSize * 0.17;
  const smallCircleSize = discSize * 0.14;
  const smallerCircleSize = discSize * 0.134;
  const centerCircleSize = discSize * 0.12;

  useEffect(() => {
    setBackendBase("https://framebackend.onrender.com");
    if (frameId) localStorage.setItem("frame_id", frameId);
  }, [frameId]);

  // Connect WebSocket
  useEffect(() => {
    if (!backendBase || !frameId) return;
    const wsBase = backendBase.replace(/^http/, "ws");
    const ws = new WebSocket(`${wsBase}/ws/${encodeURIComponent(frameId)}`);
    wsRef.current = ws;
    ws.onclose = () => { wsRef.current = null; };
    return () => { try { ws.close(); } catch {} };
  }, [backendBase, frameId]);

  const sendDelta = (delta) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "rotate", delta }));
    }
  };

  const calculateAngle = (clientX, clientY) => {
    const el = discRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const x = clientX - center.x;
    const y = clientY - center.y;
    return Math.atan2(y, x) * (180 / Math.PI);
  };

  const stopMomentum = () => {
    if (momentumRAF.current) {
      cancelAnimationFrame(momentumRAF.current);
      momentumRAF.current = null;
    }
  };

  const startMomentum = () => {
    stopMomentum();
    const step = () => {
      if (Math.abs(velocity.current) < 0.1) {
        momentumRAF.current = null;
        return;
      }
      setRotation((prev) => prev + velocity.current);
      sendDelta(velocity.current);
      velocity.current *= 0.97; // friction
      momentumRAF.current = requestAnimationFrame(step);
    };
    momentumRAF.current = requestAnimationFrame(step);
  };

  const onPointerDown = (e) => {
    // Ensure the disc keeps receiving move events even if the finger crosses children or leaves the element
    try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch {}
    isDragging.current = true;
    stopMomentum();
    const angle = calculateAngle(e.clientX, e.clientY);
    lastAngle.current = angle;
    lastTime.current = performance.now();
    e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    const now = performance.now();
    const newAngle = calculateAngle(e.clientX, e.clientY);

    let angleDelta = newAngle - lastAngle.current;
    if (angleDelta > 180) angleDelta -= 360;
    if (angleDelta < -180) angleDelta += 360;

    const dampening = 0.4;
    const dampedDelta = angleDelta * dampening;

    const timeDelta = Math.max(1, now - lastTime.current);
    velocity.current = dampedDelta / (timeDelta / 16);

    setRotation((prev) => prev + dampedDelta);
    sendDelta(dampedDelta);

    lastAngle.current = newAngle;
    lastTime.current = now;
    e.preventDefault();
  };

  const endDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    try { discRef.current?.releasePointerCapture?.(); } catch {}
    startMomentum();
  };

  const onPointerUp = (e) => {
    endDrag();
    e.preventDefault();
  };

  const onPointerCancel = () => {
    // Treat cancellations like a lift, but stop momentum (usually a gesture or app switch)
    isDragging.current = false;
    stopMomentum();
  };

  // const toggleTheme = () => {
  //     const next = !darkMode;
  //     setDarkMode(next);
  //     try {
  //       localStorage.setItem('theme', next ? 'dark' : 'light');
  //     } catch {}
  //   };

  const handleLogout = async () => {
    const storedFrameId = localStorage.getItem("frame_id") || frameId;

    try {
      await fetch(`${backendBase}/logout${storedFrameId ? `?frame_id=${storedFrameId}` : ''}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    }

    localStorage.removeItem("spotifyUser");
    localStorage.removeItem("frame_id");
    setShowCloseMessage(true);
  };

// Background classes (light vs dark neumorphic)
  const bgClass = darkMode
    ? 'bg-gradient-to-br from-gray-900 to-gray-800'
    : 'bg-gradient-to-br from-gray-200 to-gray-300';




  return (
  <div className={`fixed inset-0 flex flex-col items-center justify-center ${bgClass} overflow-hidden`}>
      {/* <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Frame Linked Successfully 🎉
      </h1> */}
      {/* Fixed logout button in the top-right when not showing close message */}
      {!showCloseMessage && (
        <div className="fixed top-6 right-6 z-50 flex gap-3 items-center">
          <button
            onClick={handleLogout}
            className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-[8px_8px_16px_#b8bcc6,-8px_-8px_16px_#ffffff] transition-all hover:shadow-[inset_4px_4px_8px_#b8bcc6,inset_-4px_-4px_8px_#ffffff] active:shadow-[inset_6px_6px_12px_#b8bcc6,inset_-6px_-6px_12px_#ffffff]"
          >
            Logout
        </button>
        </div>
      )}
      {/* <p className="text-gray-600 mb-6">
        Frame ID: <span className="font-mono">{frameId}</span>
      </p> */}

      {/* Controller disc (styled like SongCD, no album art) */}
      {!showCloseMessage && (
        <div
        ref={discRef}
        className="relative rounded-full cursor-grab active:cursor-grabbing select-none border-2 border-[#d3d3d3] shadow-[0_0_80px_-20px_rgba(0,0,0,0.3)]"
        style={{
          width: discSize,
          height: discSize,
          transform: `rotate(${rotation}deg)`,
          willChange: "transform",
          touchAction: "none", // critical on mobile
          userSelect: "none",
          background: `
            radial-gradient(circle at 50% 50%,
              #ffffff 0%,
              #d1d1d1 25%,
              #a8a8a8 50%,
              #808080 75%,
              #cfcfcf 100%
            ),
            conic-gradient(
              from 0deg,
              rgba(255, 0, 255, 0.3) 0deg,
              rgba(0, 255, 255, 0.3) 60deg,
              rgba(255, 255, 0, 0.3) 120deg,
              rgba(255, 0, 255, 0.3) 180deg,
              rgba(0, 255, 255, 0.3) 240deg,
              rgba(255, 255, 0, 0.3) 300deg,
              rgba(255, 0, 255, 0.3) 360deg
            )
          `,
          backgroundBlendMode: "screen, overlay",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        // Important: don't end drag on touch pointerleave; keep it only for mouse
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse' && isDragging.current) endDrag();
        }}
      >
        {/* Rings mirror SongCD; mark as pointer-events-none so the outer disc gets all pointer events */}
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center pointer-events-none">
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.1px] border-white bg-transparent opacity-35"
            style={{ width: outerRingSize, height: outerRingSize }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.75px] border-white backdrop-blur-sm"
            style={{ width: centerHoleSize, height: centerHoleSize }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-dotted border-gray-200/15"
            style={{ width: dottedRingSize, height: dottedRingSize }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.8px] border-white bg-[#c3c3c5] opacity-70"
            style={{ width: innerRingSize, height: innerRingSize }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#bdbabc]"
            style={{ width: middleCircleSize, height: middleCircleSize }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#cfcdcf]"
            style={{ width: smallCircleSize, height: smallCircleSize }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e9e4ea]"
            style={{ width: smallerCircleSize, height: smallerCircleSize }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1px] border-[#c8c7c5] bg-[#f5f5f5] shadow-[0_0_24px_-12px_rgba(0,0,0,0.30)_inset]"
            style={{ width: centerCircleSize, height: centerCircleSize }}
          />
        </div>
      </div>
      )}

      {showCloseMessage ? (
        <div className="text-center mt-6 text-gray-700">
          ✅ You’ve been logged out.
          <br />You can safely close this window.
        </div>
      ) : null}
    </div>
  );
}
