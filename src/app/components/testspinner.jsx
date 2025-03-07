import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function SpinnableCD() {
  const [rotation, setRotation] = useState(0);
  const isDragging = useRef(false);
  const lastAngle = useRef(0);
  const lastTime = useRef(0);
  const velocity = useRef(0);
  const animationFrame = useRef(null);

  const calculateAngle = (e, center) => {
    const x = e.clientX - center.x;
    const y = e.clientY - center.y;
    return Math.atan2(y, x) * (180 / Math.PI);
  };

  const handlePointerDown = (e) => {
    isDragging.current = true;
    cancelAnimationFrame(animationFrame.current); // Stop existing momentum
    const rect = e.currentTarget.getBoundingClientRect();
    const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    lastAngle.current = calculateAngle(e, center);
    lastTime.current = performance.now();
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const newAngle = calculateAngle(e, center);
    const now = performance.now();

    // Calculate angle difference and time difference
    const angleDelta = newAngle - lastAngle.current;
    const timeDelta = now - lastTime.current;
    
    // Normalize angle change across 360° boundaries
    const adjustedDelta = angleDelta > 180 ? angleDelta - 360 : angleDelta < -180 ? angleDelta + 360 : angleDelta;

    velocity.current = adjustedDelta / (timeDelta / 16); // Approximate velocity (degrees per frame)
    setRotation((prev) => prev + adjustedDelta);

    lastAngle.current = newAngle;
    lastTime.current = now;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    applyMomentum();
  };

  const applyMomentum = () => {
    if (Math.abs(velocity.current) < 0.1) return; // Stop if velocity is too low

    animationFrame.current = requestAnimationFrame(() => {
      setRotation((prev) => prev + velocity.current);
      velocity.current *= 0.97; // Apply friction to slow down
      applyMomentum();
    });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <motion.div
        className="w-56 h-56 bg-gray-300 rounded-full shadow-xl flex items-center justify-center border-[6px] border-gray-400 relative select-none"
        style={{ rotate: `${rotation}deg` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Inner Hole */}
        <div className="w-8 h-8 bg-black rounded-full absolute">HIIIIIIIII</div>
      </motion.div>
    </div>
  );
}
