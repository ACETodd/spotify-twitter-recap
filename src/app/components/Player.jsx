"use client";

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import NowPlayingBar from './NowPlayingBar'

const Player = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [size, setSize] = useState(500);
  
  useEffect(() => {
    // Function to update size based on viewport width
    const updateSize = () => {
      const viewportWidth = window.innerWidth;
      // Set CD size relative to viewport, with min and max constraints
      const newSize = Math.min(Math.max(viewportWidth * 0.5, 250), 500);
      setSize(newSize);
    };
    
    // Set initial size
    updateSize();
    
    // Add resize listener
    window.addEventListener('resize', updateSize);
    
    // Clean up
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const outerRingSize = size * 0.96; // 480/500
  const centerHoleSize = size * 0.3;  // 150/500
  const dottedRingSize = size * 0.286; // 143/500
  const innerRingSize = size * 0.254;  // 127/500
  const middleCircleSize = size * 0.17; // 85/500
  const smallCircleSize = size * 0.14;  // 70/500
  const smallerCircleSize = size * 0.134; // 67/500
  const centerCircleSize = size * 0.12;  // 60/500
  
  const barWidth = Math.min(size * 2, window.innerWidth * 0.95); // Twice CD size but max 95% of viewport
  const barHeight = size * 0.256; // Proportional to CD size (32/500 ratio)

  // Bottom error bar size calculations
  const errorBarWidth = size * 2; // Twice the CD size
  const errorBarHeight = size * 0.256; // 32/500 of CD size


  // Get access token from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('spotifyUser');
    if (userData) {
      const { access_token } = JSON.parse(userData);
      setAccessToken(access_token);
    }
  }, []);

  const fetchCurrentTrack = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        `http://localhost:8000/currently-playing?access_token=${accessToken}`,
        {
          headers: {
            'Accept': 'application/json',
            'Origin': 'http://localhost:3000'
          },
          credentials: 'include'
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch currently playing track');
      }
      
      const data = await response.json();
      console.log('Current track data:', data);
      setCurrentTrack(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching track:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchCurrentTrack();
      const interval = setInterval(fetchCurrentTrack, 30000);
      return () => clearInterval(interval);
    }
  }, [accessToken]);

  if (!accessToken) {
    return (
        <div className="bg-emerald-400 py-4 h-44 w-96">
        <div className="text-center p-4">Please log in to Spotify</div>;
        </div>
    ) 
  }

  if (isLoading) {
    return (
      <NowPlayingBar track={"loading"} size={size}/>
    )
  }

  if (error) {
    return (
      <div>
      <div>
      <NowPlayingBar track={"error"} size={size} title={"Error"}/>
        <motion.div 
      className="fixed left-1/2 z-[1001] flex origin-center select-none items-center justify-center border-2 border-[#d3d3d3] shadow-[0_0_80px_-20px_rgba(0,0,0,0.3)] text-white"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${size / 2}px`,
        // Fixed positioning adjustment - position from bottom of viewport for consistent appearance
        bottom: `-${size * 0.54}px`, // Half of the CD will be hidden below viewport
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
      initial={{ x: "-50%" }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 100px -20px rgba(0,0,0,0.5)"
      }}
      animate={{ 
        rotate: 360,
        x: "-50%"
      }}
      transition={{
        rotate: {
          duration: 20,
          ease: "linear",
          repeat: Infinity
        }
      }}
    >
      {/* Light Reflection Effect */}
      <div 
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          opacity: 1,
          background: `
            radial-gradient(circle at 50% 50%, 
              rgba(255,255,255,0.8) 0%, 
              rgba(255,255,255,0.2) 30%, 
              rgba(0,0,0,0.1) 70%
            )
          `,
          mixBlendMode: "soft-light"
        }}
      />
      
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
    </div>
     
    )
  }

  if (!currentTrack?.is_playing || !currentTrack?.track) {
    return (
      <div>
      <div>
        <NowPlayingBar track={"No track playing"} size={size} title={"No Track Currently"}/>
        <motion.div 
          className="fixed left-1/2 z-[1001] flex origin-center select-none items-center justify-center border-2 border-[#d3d3d3] shadow-[0_0_80px_-20px_rgba(0,0,0,0.3)] text-white"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: `${size / 2}px`,
            // Fixed positioning adjustment - position from bottom of viewport for consistent appearance
            bottom: `-${size * 0.54}px`, // Half of the CD will be hidden below viewport
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
          initial={{ x: "-50%" }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 100px -20px rgba(0,0,0,0.5)"
          }}
          animate={{ 
            rotate: 360,
            x: "-50%"
          }}
          transition={{
            rotate: {
              duration: 20,
              ease: "linear",
              repeat: Infinity
            }
          }}
        >
          {/* Light Reflection Effect */}
          <div 
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              opacity: 1,
              background: `
                radial-gradient(circle at 50% 50%, 
                  rgba(255,255,255,0.8) 0%, 
                  rgba(255,255,255,0.2) 30%, 
                  rgba(0,0,0,0.1) 70%
                )
              `,
              mixBlendMode: "soft-light"
            }}
          />
          
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
    </div>
     
    )
  }

  const { track } = currentTrack;
  
  // Safely handle image URL
  const albumImage = track?.album?.images?.[0]?.url || '/api/placeholder/300/300';
  
  // Only render if we have the minimum required data
  if (!track.name || !track.artists) {
    return <div className="text-center p-4">Unable to load track information</div>;
  }

  return (
    <div>
        <NowPlayingBar track={track} size={size} title={"Now Playing"}/>
        <motion.div 
          className="fixed left-1/2 z-[1001] flex origin-center select-none items-center justify-center border-2 border-[#d3d3d3] shadow-[0_0_80px_-20px_rgba(0,0,0,0.3)] text-white"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: `${size / 2}px`,
            // Fixed positioning adjustment - position from bottom of viewport for consistent appearance
            bottom: `-${size * 0.54}px`, // Half of the CD will be hidden below viewport
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
          initial={{ x: "-50%" }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 100px -20px rgba(0,0,0,0.5)"
          }}
          animate={{ 
            rotate: 360,
            x: "-50%"
          }}
          transition={{
            rotate: {
              duration: 20,
              ease: "linear",
              repeat: Infinity
            }
          }}
        >
          {/* Light Reflection Effect */}
          <div 
            className="absolute inset-0 rounded-full overflow-hidden"
          >
          <img
                src={albumImage}
                alt={track.album?.name || 'Album Cover'}
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
  );
};

export default Player;