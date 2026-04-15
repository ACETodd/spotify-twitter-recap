import { useEffect, useState, useRef, useLayoutEffect } from "react";
import CDHolder from './CDHolder'
import SongCD from './SongCD';
import NeuDesc from './NeuDesc'
import SpinnableCD from './testspinner'
import { getValidAccessToken } from "./../getValidToken";

export default function SongPage({user, setUser}) {

  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null)
  const [size, setSize] = useState(700);
  const hubSize = size * 0.18; // Adjusted proportionally to `size`
  const middleRingSize = hubSize * 0.6;
  const spindleHoleSize = hubSize * 0.2
  const lastTrackIdRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fadeState, setFadeState] = useState("fadeIn");

  
  useLayoutEffect(() => {
    const updateSize = () => {
      const viewportWidth = window.innerWidth;
      const newSize = Math.min(viewportWidth * 0.6, 900);
      setSize(newSize);
    };
  
    updateSize();
    window.addEventListener('resize', updateSize);
  
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (!user?.access_token) return;

    const fetchCurrentlyPlaying = async () => {
      try {
        const token = await getValidAccessToken(user, setUser);
        if (!token) {
          console.warn("No valid token; need to login again.");
          return;
        }

        let res = await fetch(
          `https://framebackend.onrender.com/currently-playing?access_token=${token}`
        );

        // If Spotify says 401 anyway, force refresh once and retry
        if (res.status === 401) {
          const token2 = await getValidAccessToken({ ...user, expires_at: 0 }, setUser);
          if (!token2) return;

          res = await fetch(
            `https://framebackend.onrender.com/currently-playing?access_token=${token2}`
          );
        }


        if (!res.ok) {
          if (res.status === 401) {
            console.warn("Access token expired — need to refresh.");
          } else {
            console.error(`Spotify API returned ${res.status}: ${res.statusText}`);
          }
          return;
        }

        const data = await res.json();
        console.log('data', data)
        const track = data?.track || null;
        const isPlaying = Boolean(data?.is_playing);

        if (isPlaying && track) {
          if (lastTrackIdRef.current !== track.name) {
            setFadeState("fadeOut");
            setTimeout(() => {
              setCurrentTrack(track);
              lastTrackIdRef.current = track.name;
              console.log("▶️ Now playing:", track.name);
            // 3️⃣ Then trigger fade-in
            setFadeState("fadeIn");
          }, 600); // match your fadeOut duration
            
          }
          setIsPlaying(true);
        } else {
          setIsPlaying(false);

          if (track && lastTrackIdRef.current === track.name) {
            console.log("⏸️ Song paused:", track.name);
          } else {
            if (lastTrackIdRef.current) {
              console.log("🛑 No song playing.");
              setCurrentTrack(null);
              lastTrackIdRef.current = null;
            }
          }
        }
      } catch (err) {
        console.error("⚠️ Error fetching currently playing:", err);
        setCurrentTrack(null);
        lastTrackIdRef.current = null;
      }
    };

    fetchCurrentlyPlaying();
    const interval = setInterval(fetchCurrentlyPlaying, 5000);
    return () => clearInterval(interval);
  }, [user, setUser]);


  return (
    <div className="min-h-screen flex sm:flex-row flex-col items-center justify-between bg-gradient-to-br from-gray-200 to-gray-300 mb-40 sm:mb-0 sm:overflow-y-hidden">
              <div className="sm:w-1/4 w-full ">
              {/* <CDHolder user={user} currentTrack={currentTrack} setCurrentTrack={setCurrentTrack} setCurrentTrackIndex={setCurrentTrackIndex}/> */}
              </div>
          
                <div className="relative w-full">
                  <div 
                    className="absolute left-1/2 top-[75%] sm:top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 shadow-[inset_8px_8px_16px_#b8bcc6,inset_-8px_-8px_16px_#ffffff] flex items-center justify-center"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      borderRadius: `${size / 2}px`,
                    }}
                    >
                      {/* <PlayerTest/> */}
                      <SongCD currentTrack={currentTrack} size={size * 0.88} isPlaying={isPlaying} />

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
                  <div 
                    key={currentTrack?.name || 'placeholder'} 
                    className={`fixed bottom-[25rem] right-[11rem] text-right ${
                      fadeState === "fadeIn" ? "animate-fadeIn" : "animate-fadeOut"
                    }`}
                    style={{maxWidth: 525}}
                  >
                    <p className="text-gray-800 font-mono font-semibold text-lg">
                      {currentTrack?.name || ''}
                    </p>
                    {currentTrack?.artists?.[0] && (
                      <p className="text-gray-700 font-mono text-sm">
                        by {currentTrack.artists[0]}
                      </p>
                    )}
                  </div>
                </div>
                {/* CD Player Start */}
                
            
            <div className="sm:w-1/4 h-44 sm:h-full">
            {/* <NeuDesc currentTrack={currentTrack} currentTrackIndex={currentTrackIndex}/> */}
            </div>

        </div>
  )
}
