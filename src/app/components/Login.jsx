import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import RecentTracks from './RecentTracks'
import TopMusicCard from './TopMusicCard'
import Icerber from './iceber'
import Genres from './Genres'
import TopTracksCard from './TopTracksCard'
import TopAlbumsCard from './TopAlbumsCard'
import Player from './Player'
import GenreList from "./GenreList";
import Carousel from './Carousel'

export default function Login({ user, onLogin, handleLogout }) {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileImgRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle clicks/touches outside to close dropdown
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current && 
        profileImgRef.current && 
        !dropdownRef.current.contains(event.target) && 
        !profileImgRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    
    // Add both mouse and touch event listeners
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  const handleLogin = () => {
    window.location.href = "http://localhost:8000/login";
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <button 
          onClick={handleLogin}
          className="bg-emerald-400 hover:bg-emerald-600 font-bold py-3 px-6 rounded"
        >
          Login with Spotify
        </button>
      </div>
    )
  } else {
    return (
      <div className="min-h-screen bg-black">
        <header className="mx-auto sm:px-4 sm:py-5 p-2 pb-4 flex justify-between">
          <div className="sm:text-lg font-bold text-gray-900 font-mono bg-emerald-400 flex items-center justify-center px-2">
            <div>Spotify Advanced Analytics</div>
          </div>

          <div className="flex items-center justify-center relative sm:space-x-3">
          <div className="hidden sm:block">
                  <div className="text-lg font-bold text-white font-mono">Welcome, {user.display_name}</div>
          </div>
            <img 
              ref={profileImgRef}
              src={user.images?.[0]?.url || "/api/placeholder/40/40"} 
              alt="Profile" 
              className="w-12 h-12 rounded-full cursor-pointer"
              onClick={toggleDropdown}
            />
            
            {isDropdownOpen && (
              <div 
                ref={dropdownRef}
                className="absolute right-0 top-14 w-48 py-2 bg-zinc-800 rounded-md shadow-lg z-10"
              >
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-700 active:bg-zinc-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>          
        </header>

            <Carousel user={user}/>
            <div className="">
                <div className="sm:m-6 sm:my-8 flex align-center justify-stretch flex-col xl:flex-row">
                  <TopAlbumsCard user={user}/>
                  <TopMusicCard user={user} />
                </div>
                <Player/>
            </div>
        </div>      
    )
  }
}
