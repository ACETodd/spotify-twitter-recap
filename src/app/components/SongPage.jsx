import { useEffect, useState, useRef, useLayoutEffect } from "react";
import CDHolder from './CDHolder'
import SongCD from './SongCD';
import NeuDesc from './NeuDesc'
import SpinnableCD from './testspinner'

export default function SongPage({user}) {

  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null)
  const [size, setSize] = useState(560);
  const hubSize = size * 0.18; // Adjusted proportionally to `size`
  const middleRingSize = hubSize * 0.6;
  const spindleHoleSize = hubSize * 0.2

  useLayoutEffect(() => {
    const updateSize = () => {
      const viewportWidth = window.innerWidth;
      const newSize = Math.min(Math.max(viewportWidth * 0.5, 280), 560);
      setSize(newSize);
    };
  
    updateSize();
    window.addEventListener('resize', updateSize);
  
    return () => window.removeEventListener('resize', updateSize);
  }, []);


  return (
    <div className="min-h-screen flex sm:flex-row flex-col items-center justify-between bg-gradient-to-br from-gray-200 to-gray-300 mb-40 sm:mb-0 sm:overflow-y-hidden">
              <div className="sm:w-1/4 w-full ">
              <CDHolder user={user} currentTrack={currentTrack} setCurrentTrack={setCurrentTrack} setCurrentTrackIndex={setCurrentTrackIndex}/>
              </div>
          

                {/* CD Player Start */}
                <div 
                  className="absolute left-1/2 top-[70%] sm:top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 shadow-[inset_8px_8px_16px_#b8bcc6,inset_-8px_-8px_16px_#ffffff] flex items-center justify-center"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    borderRadius: `${size / 2}px`,
                  }}
                  >
                    {/* <PlayerTest/> */}
                    <SongCD currentTrack={currentTrack} size={size * 0.88} />

                    <div className="relative rounded-full bg-gray-200 shadow-[8px_8px_16px_#b8bcc6,-8px_-8px_16px_#ffffff] flex items-center justify-center"
                    style={{ width: `${hubSize}px`, height: `${hubSize}px` }}
                    >
                      {/* Middle Ring */}
                      <div className="absolute w-[60px] h-[60px] rounded-full bg-gray-300 shadow-[inset_4px_4px_8px_#a8a8a8,inset_-4px_-4px_8px_#ffffff]"
                      style={{ width: `${middleRingSize}px`, height: `${middleRingSize}px` }}
                      ></div>
                    
                      {/* Very Center (Spindle Hole) */}
                      <div className="absolute w-[20px] h-[20px] rounded-full bg-gray-400 shadow-[inset_2px_2px_4px_#808080,inset_-2px_-2px_4px_#cfcfcf]"
                      style={{ width: `${spindleHoleSize}px`, height: `${spindleHoleSize}px` }}
                      ></div>
                    </div>
                  </div>
            
            <div className="sm:w-1/4 h-28 sm:h-full ">
            <NeuDesc currentTrack={currentTrack} currentTrackIndex={currentTrackIndex}/>
            </div>

        </div>
  )
}
