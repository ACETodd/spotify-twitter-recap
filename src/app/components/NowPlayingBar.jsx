import React, { useEffect, useState } from 'react';

const NowPlayingBar = ({ track, size, title }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Function to check window width and update visibility
    const checkMobileWidth = () => {
      // Hide on screens smaller than 640px (typical mobile breakpoint)
      setIsVisible(window.innerWidth >= 640);
    };
    
    // Initial check
    checkMobileWidth();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobileWidth);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobileWidth);
  }, []);
  
  // Calculate the bar width based on CD size for consistency
  const barWidth = Math.min(size * 2, window.innerWidth * 0.95); // Twice CD size but max 95% of viewport
  const barHeight = size * 0.256; // Proportional to CD size (32/500 ratio)
  
  // If not visible, don't render anything
  if (!isVisible) return null;
  
  return (
    <div className="fixed left-1/2 -translate-x-1/2 z-5 bg-gray-800 rounded-t-3xl flex flex-wrap items-center justify-between px-2 z-[1000]"
         style={{
           width: `${barWidth}px`,
           height: `${barHeight}px`,
           bottom: 0, // Fixed at bottom of viewport
           minHeight: '60px', // Minimum height for readability
         }}>
      <div className="text-white font-mono text-center p-2 md:p-4 flex-1 md:flex-none">
        <p className="text-base md:text-xl font-bold truncate text-start">{title}</p>
        <p className="mt-1 text-sm md:text-base truncate text-left">{track?.name || 'Unknown Track'}</p>
      </div>
      <div className="text-white font-mono text-center p-2 md:p-4 flex-1 md:flex-none">
        <p className="mt-1 text-sm md:text-base truncate text-right">
          {track?.artists 
            ? (Array.isArray(track.artists) 
                ? track.artists.join(', ') 
                : track.artists)
            : 'Unknown Artist'
          }
        </p>
      </div>
    </div>
  );
};

export default NowPlayingBar;