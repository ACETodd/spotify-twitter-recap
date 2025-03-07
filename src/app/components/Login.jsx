import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import TopMusicCard from './TopMusicCard'
import Icerber from './iceber'
import Genres from './Genres'
import TopAlbumsCard from './TopAlbumsCard'
import Player from './Player'
import PlayerTest  from './PlayerTest'
import GenreList from "./GenreList";
import Carousel from './Carousel'
import CDHolder from './CDHolder'
import SongCD from './SongCD';
import NeuDesc from './NeuDesc'

export default function Login({ user, handleLogout }) {

  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null)
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const dropdownRef = useRef(null);
  // const profileImgRef = useRef(null);
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

  // const toggleDropdown = () => {
  //   setIsDropdownOpen(!isDropdownOpen);
  // };

  // // Handle clicks/touches outside to close dropdown
  // useEffect(() => {
  //   const handleOutsideClick = (event) => {
  //     if (
  //       dropdownRef.current && 
  //       profileImgRef.current && 
  //       !dropdownRef.current.contains(event.target) && 
  //       !profileImgRef.current.contains(event.target)
  //     ) {
  //       setIsDropdownOpen(false);
  //     }
  //   };
    
  //   // Add both mouse and touch event listeners
  //   document.addEventListener('mousedown', handleOutsideClick);
  //   document.addEventListener('touchstart', handleOutsideClick);
    
  //   return () => {
  //     document.removeEventListener('mousedown', handleOutsideClick);
  //     document.removeEventListener('touchstart', handleOutsideClick);
  //   };
  // }, []);

  const handleLogin = () => {
    window.location.href = "https://spotify-advanced-analytics.onrender.com/login";
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
      <button 
        onClick={handleLogin}
        className="bg-emerald-400 hover:bg-emerald-600 font-bold py-3 px-6 rounded shadow-[0_0_20px_rgba(52,211,153,0.6)] transition-all"
      >
        Login with Spotify
      </button>
    </div>

    )
  } else {
    return (
      <div className="min-h-screen flex sm:flex-row flex-col items-center justify-between bg-gradient-to-br from-gray-200 to-gray-300">
          <div className="sm:w-1/4 w-full ">
          <CDHolder user={user} currentTrack={currentTrack} setCurrentTrack={setCurrentTrack} setCurrentTrackIndex={setCurrentTrackIndex}/>
          </div>
       

            {/* CD Player Start */}
            <div 
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 shadow-[inset_8px_8px_16px_#b8bcc6,inset_-8px_-8px_16px_#ffffff] flex items-center justify-center"
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
        
        <div className="sm:w-1/4 h-72 sm:h-full">
        <NeuDesc currentTrack={currentTrack} currentTrackIndex={currentTrackIndex}/>
        </div>

      </div>














      // <div className="min-h-screen bg-black">
      //   <header className="mx-auto sm:px-4 sm:py-5 p-2 pb-4 flex justify-between">
      //     <div className="sm:text-lg font-bold text-gray-900 font-mono bg-emerald-400 flex items-center justify-center px-2">
      //       <div>Spotify Advanced Analytics</div>
      //     </div>

      //     <div className="flex items-center justify-center relative sm:space-x-3">
      //     <div className="hidden sm:block">
      //             <div className="text-lg font-bold text-white font-mono">Welcome, {user.display_name}</div>
      //     </div>
      //       <img 
      //         ref={profileImgRef}
      //         src={user.images?.[0]?.url || "/api/placeholder/40/40"} 
      //         alt="Profile" 
      //         className="w-12 h-12 rounded-full cursor-pointer"
      //         onClick={toggleDropdown}
      //       />
            
      //       {isDropdownOpen && (
      //         <div 
      //           ref={dropdownRef}
      //           className="absolute right-0 top-14 w-48 py-2 bg-zinc-800 rounded-md shadow-lg z-10"
      //         >
      //           <button 
      //             onClick={handleLogout}
      //             className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-700 active:bg-zinc-600"
      //           >
      //             Logout
      //           </button>
      //         </div>
      //       )}
      //     </div>          
      //   </header>

      //       <Carousel user={user}/>
      //       <div>
      //           <div className="sm:m-6 sm:my-8 flex sm:items-start justify-stretch flex-col sm:flex-row sm:space-x-8 pb-48">
      //             <TopAlbumsCard user={user}/>
      //             <TopMusicCard user={user} />
      //           </div>
      //           <Player/>
      //       </div>
      //   </div>      
    )
  }
}
