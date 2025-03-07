"use client";

import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { motion } from "framer-motion";
import NowPlayingBar from './NowPlayingBar'

const Player = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [size, setSize] = useState(500);
  const [tokenExpiry, setTokenExpiry] = useState(null);
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  
  useLayoutEffect(() => {
    const updateSize = () => {
      const viewportWidth = window.innerWidth;
      const newSize = Math.min(Math.max(viewportWidth * 0.5, 250), 500);
      setSize(newSize);
    };
  
    updateSize();
    window.addEventListener('resize', updateSize);
  
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  

  const outerRingSize = size * 0.96; 
  const centerHoleSize = size * 0.3;  
  const dottedRingSize = size * 0.286; 
  const innerRingSize = size * 0.254;  
  const middleCircleSize = size * 0.17; 
  const smallCircleSize = size * 0.14;  
  const smallerCircleSize = size * 0.134; 
  const centerCircleSize = size * 0.12;  
  
  // Get access token from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('spotifyUser');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setAccessToken(parsedData.access_token);
        setRefreshToken(parsedData.refresh_token);
        
        // Set token expiry
        if (parsedData.expires_at) {
          setTokenExpiry(parseInt(parsedData.expires_at));
        } else if (parsedData.expires_in) {
          const expiryTime = Date.now() + (parsedData.expires_in * 1000);
          setTokenExpiry(expiryTime);
          
          // Update localStorage with expiry time
          parsedData.expires_at = expiryTime.toString();
          localStorage.setItem('spotifyUser', JSON.stringify(parsedData));
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const refreshAccessToken = useCallback(async () => {
    // Limit refresh attempts to prevent infinite loops
    if (refreshAttempts >= 3) {
      console.error('Max refresh attempts reached');
      setIsLoading(false);
      return false;
    }

    if (!refreshToken || refreshing) return false;
    
    setRefreshing(true);
    setRefreshAttempts(prev => prev + 1);

    try {
      console.log("Refreshing access token for Player...");
      const response = await fetch('https://spotify-advanced-analytics.onrender.com/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000'
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        console.error(`Token refresh failed: ${response.status}`);
        setRefreshing(false);
        setIsLoading(false);
        return false;
      }
      
      const data = await response.json();
      console.log("Token refreshed successfully for Player");
      
      // Update tokens in state
      setAccessToken(data.access_token);
      
      // Spotify might return a new refresh token, so update it if present
      if (data.refresh_token) {
        setRefreshToken(data.refresh_token);
      }
      
      // Calculate and store new expiry time
      const expiryTime = Date.now() + (data.expires_in * 1000);
      setTokenExpiry(expiryTime);
      
      // Update localStorage
      try {
        const userData = JSON.parse(localStorage.getItem('spotifyUser') || '{}');
        userData.access_token = data.access_token;
        if (data.refresh_token) {
          userData.refresh_token = data.refresh_token;
        }
        userData.expires_at = expiryTime.toString();
        userData.expires_in = data.expires_in;
        localStorage.setItem('spotifyUser', JSON.stringify(userData));
      } catch (error) {
        console.error("Error updating localStorage after token refresh:", error);
      }
      
      setRefreshing(false);
      setRefreshAttempts(0);
      return true;
    } catch (err) {
      console.error('Error refreshing token in Player:', err);
      setRefreshing(false);
      setIsLoading(false);
      return false;
    }
  }, [refreshToken, refreshing, refreshAttempts]);

  const checkAndRefreshToken = useCallback(async () => {
    // If no token expiry is set, assume token is valid (will be caught by API if invalid)
    if (!tokenExpiry) return accessToken ? true : false;
    
    // If token is expired or about to expire in the next 5 minutes (300000 ms)
    if (Date.now() > tokenExpiry - 300000) {
      console.log('Token expired or about to expire in Player, refreshing...');
      return await refreshAccessToken();
    }
    
    return accessToken ? true : false;
  }, [accessToken, tokenExpiry, refreshAccessToken]);

  const fetchCurrentTrack = useCallback(async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    // Check token validity before making the request
    const isTokenValid = await checkAndRefreshToken();
    if (!isTokenValid) {
      console.error('Could not use/refresh token in Player');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://spotify-advanced-analytics.onrender.com/currently-playing?access_token=${accessToken}`,
        {
          headers: {
            'Accept': 'application/json',
            'Origin': 'http://localhost:3000'
          },
          credentials: 'include'
        }
      );
      
      if (response.status === 401) {
        console.log('Token expired during request in Player, attempting to refresh...');
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          // Try one more time with the new token
          return fetchCurrentTrack();
        }
        
        console.error('Unable to refresh token after 401 in Player');
        setIsLoading(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch currently playing track');
      }
      
      const data = await response.json();
      console.log('Current track data:', data);
      setCurrentTrack(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching track:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, checkAndRefreshToken, refreshAccessToken]);

  useEffect(() => {
    if (accessToken) {
      // Initial fetch
      fetchCurrentTrack();
      
      // Setup periodic token check and data refresh
      const interval = setInterval(() => {
        checkAndRefreshToken().then(valid => {
          if (valid) {
            fetchCurrentTrack();
          }
        });
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [accessToken, checkAndRefreshToken, fetchCurrentTrack]);

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
      {/* <NowPlayingBar track={"error"} size={size} title={"Error"}/> */}
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
        {/* <NowPlayingBar track={"No track playing"} size={size} title={"No Track Currently"}/> */}
        <motion.div 
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
          initial={{ x: "-50%", y: "-50%" }}
          whileHover={{
            scale: 1.02,
            // boxShadow: "0 0 100px -20px rgba(0,0,0,0.5)"
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
        {/* <NowPlayingBar track={track} size={size} title={"Now Playing"}/> */}
        <motion.div 
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
          initial={{ x: "-50%", y: "-50%" }}
          whileHover={{
            scale: 1.02,
            // boxShadow: "0 0 100px -20px rgba(0,0,0,0.5)"
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