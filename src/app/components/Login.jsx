import { useEffect, useState } from "react";
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

export default function Login({ user, onLogin }) {

  const [showIceberg, setShowIceberg] = useState(false);

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
        <header className="mx-auto px-4 py-5 flex justify-between">
          <div className="text-lg font-bold text-gray-900 font-mono bg-red-400 flex items-center justify-center px-2">
            <div>Spotify Advanced Analytics</div>
          </div>

          <div className="flex items-center space-x-3">
                <img 
                  src={user.images?.[0]?.url || "/api/placeholder/40/40"} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="text-lg font-bold text-white font-mono">Welcome, {user.display_name}</div>
                  <div className="text-gray-400 font-mono">{user.email}</div>
                </div>
          </div>
        </header>

            <Carousel user={user}/>
            <div className="">
                <div className="m-6 my-8 flex align-center justify-stretch flex-col xl:flex-row">
                  <TopAlbumsCard user={user}/>
                  <TopMusicCard user={user} />
                </div>
                <Player/>
            </div>
        </div>      
    )
  }
}
