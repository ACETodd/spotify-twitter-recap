import React, {useState, useEffect, useRef} from 'react'
import { motion, useAnimationControls } from 'framer-motion';

export default function SongCD({currentTrack, size}) {
      const [animate, setAnimate] = useState(false)
      const [rotation, setRotation] = useState(0);
      const isDragging = useRef(false);
      const lastAngle = useRef(0);
      const lastTime = useRef(0);
      const velocity = useRef(0);
      const animationFrame = useRef(null);
      const autoRotationRef = useRef(null);
      const controls = useAnimationControls();

      // Separate state to track user interaction
      const [isUserInteracting, setIsUserInteracting] = useState(false);
      
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
        if (isUserInteracting) return;
        
        setRotation(prevRotation => prevRotation + 0.1); // Small increment per frame
        autoRotationRef.current = requestAnimationFrame(handleAutoRotation);
      };
      
      // Start auto rotation whenever user is not interacting
      useEffect(() => {
        if (!isUserInteracting) {
          autoRotationRef.current = requestAnimationFrame(handleAutoRotation);
        }
        
        return () => {
          cancelAnimationFrame(autoRotationRef.current);
        };
      }, [isUserInteracting]);

      useEffect(() => {
        // Reset animation
        setAnimate(false); 
        
        // Start the appearance animation
        setTimeout(() => setAnimate(true), 50);
        
        // Ensure auto-rotation starts after appearance animation
        setTimeout(() => {
          // Reset user interaction state to false to trigger auto-rotation
          setIsUserInteracting(false);
          
          // Explicitly start auto-rotation
          if (autoRotationRef.current) {
            cancelAnimationFrame(autoRotationRef.current);
          }
          autoRotationRef.current = requestAnimationFrame(handleAutoRotation);
        }, 900); // 0.9 seconds delay as requested
        
        // Clean up animation frames on unmount
        return () => {
          cancelAnimationFrame(animationFrame.current);
          cancelAnimationFrame(autoRotationRef.current);
        };
      }, [currentTrack]);
    
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
    <div>
        <motion.div 
          key={currentTrack?.id || 'default'}
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
          animate={animate ? { 
            y: "-50%",
            scale: 1,   
            opacity: 1,
          } : {}}
          transition={{
            y: { duration: 0.7, ease: "easeInOut" }, // Smooth slide-up
            scale: { duration: 0.3, delay: 0.7 },    // "Click" effect
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
            
  </div>
  )
}