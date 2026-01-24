import React, {useState, useEffect, useRef} from 'react'
import { motion, useAnimationControls, AnimatePresence  } from 'framer-motion';

export default function SongCD({currentTrack, size, isPlaying}) {
      const [rotation, setRotation] = useState(0);
      const isDragging = useRef(false);
      const lastAngle = useRef(0);
      const lastTime = useRef(0);
      const velocity = useRef(0);
      const animationFrame = useRef(null);
      const autoRotationRef = useRef(null);
      const controls = useAnimationControls();

      // NEW: websocket refs
      const wsRef = useRef(null);
      const [backendBase, setBackendBase] = useState("");
      const [frameId, setFrameId] = useState(null);
      
      // Separate state to track user interaction
      const [isUserInteracting, setIsUserInteracting] = useState(false);
      const [entranceComplete, setEntranceComplete] = useState(false);


      // derive base + frame id (frame stores id in localStorage)
      useEffect(() => {
        try {
          const host = window.location.hostname;
          const base = host === "localhost" ? "http://192.168.1.72:8000" : `http://${host}:8000`;
          setBackendBase(base);
          setFrameId(localStorage.getItem("frame_id") || null);
        } catch {}
      }, []);

      // Connect WebSocket as the DISPLAY; apply incoming deltas
      useEffect(() => {
        if (!backendBase || !frameId) return;
        const wsBase = backendBase.replace(/^http/, "ws");
        const ws = new WebSocket(`${wsBase}/ws/${encodeURIComponent(frameId)}`);
        wsRef.current = ws;

        ws.onmessage = (evt) => {
          try {
            const msg = JSON.parse(evt.data);
            if (msg.type === "rotate" && typeof msg.delta === "number") {
              setIsUserInteracting(true);
              setRotation((prev) => prev + msg.delta);
              if (autoRotationRef.current) cancelAnimationFrame(autoRotationRef.current);
              setTimeout(() => setIsUserInteracting(false), 500);
            }
            if (msg.type === "setRotation" && typeof msg.value === "number") {
              setIsUserInteracting(true);
              setRotation(msg.value);
              setTimeout(() => setIsUserInteracting(false), 500);
            }
          } catch {}
        };

        ws.onclose = () => {
          wsRef.current = null;
        };

        return () => {
          try { ws.close(); } catch {}
        };
      }, [backendBase, frameId]);

      const getAlbumArtistKey = (track) => {
        if (!track) return null;
        const albumImage = track?.album?.images?.[0]?.url || '';
        const albumName = track?.album?.name?.trim().toLowerCase() || 'unknown-album';
        return `${albumName}-${albumImage}`;
      };


      const albumArtistKey = getAlbumArtistKey(currentTrack);

      const calculateAngle = (e, center) => {
        const x = e.clientX - center.x;
        const y = e.clientY - center.y;
        return Math.atan2(y, x) * (180 / Math.PI);
      };
    
      const handlePointerDown = (e) => {
        setIsUserInteracting(true);
        isDragging.current = true;
        cancelAnimationFrame(animationFrame.current); // Stop existing momentum
        cancelAnimationFrame(autoRotationRef.current); // Stop auto rotation
        
        // Stop the framer-motion animation
        controls.stop();
        
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
        
        // Apply a dampening factor to reduce the spinning speed (0.5 = half as fast)
        const dampening = 0.4; // Adjust this value as needed
        const dampedDelta = adjustedDelta * dampening;
    
        velocity.current = dampedDelta / (timeDelta / 16); // Approximate velocity (degrees per frame)
        setRotation((prev) => prev + dampedDelta);
    
        lastAngle.current = newAngle;
        lastTime.current = now;
      };
    
      const handlePointerUp = () => {
        isDragging.current = false;
        applyMomentum();
        
        // After momentum ends (or immediately if no momentum), start auto rotation again
        setTimeout(() => {
          setIsUserInteracting(false);
        }, Math.abs(velocity.current) < 0.1 ? 0 : 2000); // Wait for momentum to end
      };
    
      const applyMomentum = () => {
        if (Math.abs(velocity.current) < 0.1) {
          // If velocity is too low, stop momentum and start auto rotation
          setIsUserInteracting(false);
          return;
        }
    
        animationFrame.current = requestAnimationFrame(() => {
          setRotation((prev) => prev + velocity.current);
          velocity.current *= 0.97; // Apply friction to slow down
          applyMomentum();
        });
      };
      
      // Function to handle auto rotation
      const handleAutoRotation = () => {
        if (isUserInteracting || !isPlaying || !entranceComplete) return;
        
        setRotation(prevRotation => prevRotation + 0.1); // Small increment per frame
        autoRotationRef.current = requestAnimationFrame(handleAutoRotation);
      };
      
      // Start auto rotation whenever user is not interacting
      useEffect(() => {
        if (!isUserInteracting && isPlaying && entranceComplete) {
          autoRotationRef.current = requestAnimationFrame(handleAutoRotation);
        }
        
        return () => {
          cancelAnimationFrame(autoRotationRef.current);
        };
      }, [isUserInteracting, isPlaying, entranceComplete]);

      // Track if album/artist changed to control entrance animation
      const prevAlbumArtistKey = useRef(null);

      useEffect(() => {
        if (!currentTrack) return;

        const prevKey = prevAlbumArtistKey.current;
        const newKey = albumArtistKey;

        const albumChanged = prevKey !== newKey;

        if (albumChanged) {
          // Album changed — run entrance animation
          setEntranceComplete(false);
          setRotation(0);
          prevAlbumArtistKey.current = newKey;

          const timer = setTimeout(() => {
            setEntranceComplete(true);
            setIsUserInteracting(false);

            // Restart auto rotation cleanly
            cancelAnimationFrame(autoRotationRef.current);
            autoRotationRef.current = requestAnimationFrame(handleAutoRotation);
          }, 1200);

          return () => {
            clearTimeout(timer);
            cancelAnimationFrame(animationFrame.current);
            cancelAnimationFrame(autoRotationRef.current);
          };
        } else {
          // Same album — ensure it’s ready to spin immediately
          setEntranceComplete(true);
          setIsUserInteracting(false);
          cancelAnimationFrame(autoRotationRef.current);
          autoRotationRef.current = requestAnimationFrame(handleAutoRotation);
        }
      }, [currentTrack, albumArtistKey]);

    
      const outerRingSize = size * 0.96; 
      const centerHoleSize = size * 0.3;  
      const dottedRingSize = size * 0.286; 
      const innerRingSize = size * 0.254;  
      const middleCircleSize = size * 0.17; 
      const smallCircleSize = size * 0.14;  
      const smallerCircleSize = size * 0.134; 
      const centerCircleSize = size * 0.12;  

      const albumImage = currentTrack?.album?.images?.[0]?.url || '/api/placeholder/300/300';

  return (
    <AnimatePresence mode="wait">
      {currentTrack && (
        <motion.div 
          key={albumArtistKey} // CRITICAL: This key makes the animation work on track change
          className="fixed left-1/2 top-1/2 z-[1001] flex origin-center select-none items-center justify-center border-2 border-[#d3d3d3] shadow-[0_0_80px_-20px_rgba(0,0,0,0.3)] text-white"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: `${size / 2}px`,
            transform: "translate(-50%, -50%)",
            rotate: `${rotation}deg`,
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
            backgroundBlendMode: "screen, overlay"
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          initial={{ 
            y: "100vh",
            scale: 1.2, 
            opacity: 0, 
            x: "-50%"
          }}
          animate={{ 
            y: "-50%",
            scale: 1,   
            opacity: 1,
          }}
          exit={{
            y: "100vh",
            scale: 0.8,
            opacity: 0,
            transition: { duration: 0.2 }
          }}
          transition={{
            y: { duration: 0.7, ease: "easeInOut" }, // Smooth slide-up
            scale: { duration: 0.3, delay: 0.7 },    // "Click" effect
            opacity: { duration: 0.3 }
          }}
        >
          {/* Light Reflection Effect */}
          <div 
            className="absolute inset-0 rounded-full overflow-hidden"
          >
          <img
                src={albumImage}
                className='pointer-events-none select-none object-cover'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                />
          </div>
          {/* Center Hole and CD Details */}
          <div className='absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center'>
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.1px] border-white bg-transparent opacity-35"
              style={{ width: `${outerRingSize}px`, height: `${outerRingSize}px` }}
            ></div>
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.75px] border-white backdrop-blur-sm"
              style={{ width: `${centerHoleSize}px`, height: `${centerHoleSize}px` }}
            ></div>
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-dotted border-gray-200/15"
              style={{ width: `${dottedRingSize}px`, height: `${dottedRingSize}px` }}
            ></div>
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.8px] border-white bg-[#c3c3c5] opacity-70"
              style={{ width: `${innerRingSize}px`, height: `${innerRingSize}px` }}
            ></div>
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#bdbabc]"
              style={{ width: `${middleCircleSize}px`, height: `${middleCircleSize}px` }}
            ></div>
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#cfcdcf]"
              style={{ width: `${smallCircleSize}px`, height: `${smallCircleSize}px` }}
            ></div>
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e9e4ea]"
              style={{ width: `${smallerCircleSize}px`, height: `${smallerCircleSize}px` }}
            ></div>
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1px] border-[#c8c7c5] bg-[#f5f5f5] shadow-[0_0_24px_-12px_rgba(0,0,0,0.30)_inset]"
              style={{ width: `${centerCircleSize}px`, height: `${centerCircleSize}px` }}
            ></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}