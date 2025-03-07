import React, {useState, useEffect} from 'react'
import { motion } from 'framer-motion';

export default function SongCD({currentTrack, size}) {

      const [animate, setAnimate] = useState(false)
      
      useEffect(() => {
        setAnimate(false); // Reset animation
        setTimeout(() => setAnimate(true), 50); // Delay to restart animation
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

      const trackName = currentTrack?.name || 'No Track Selected';

  

  return (
    <div>
        <motion.div 
          key={currentTrack?.id || 'default'}
          className="fixed left-1/2 top-1/2 z-[1001] flex origin-center select-none items-center justify-center border-2 border-[#d3d3d3] shadow-[0_0_80px_-20px_rgba(0,0,0,0.3)] text-white"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: `${size / 2}px`,
            // Fixed positioning adjustment - position from bottom of viewport for consistent appearance
            // bottom: `-${size * 0.54}px`,
            transform: "translate(-50%, -50%)",
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
        //   initial={{ x: "-50%", y: "-50%" }}
        //   animate={{ 
        //     rotate: 360,
        //     x: "-50%"
        //   }}
        //   transition={{
        //     rotate: {
        //       duration: 20,
        //       ease: "linear",
        //       repeat: Infinity
        //     }
        //   }}
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
            rotate: 360  
          } : {}}
          transition={{
            y: { duration: 0.7, ease: "easeInOut" }, // Smooth slide-up
            scale: { duration: 0.3, delay: 0.7 },   // "Click" effect
            rotate: { duration: 20, ease: "linear", repeat: Infinity, delay: 1.1 } // Continuous spin
          }}
                    
        >
          {/* Light Reflection Effect */}
          <div 
            className="absolute inset-0 rounded-full overflow-hidden"
          >
          <img
                src={albumImage}
                // alt={trackName || 'Album Cover'}
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
