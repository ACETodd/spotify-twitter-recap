import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import Header from './Header'
import SongPage from './SongPage'
import ArtistPage from './ArtistPage'
import { motion, AnimatePresence } from "framer-motion";

export default function Login({ user, handleLogout }) {
  const [currentPage, setCurrentPage] = useState('SongPage');

  const handleLogin = () => {
    window.location.href = "https://spotify-advanced-analytics.onrender.com/login";
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-200 to-gray-300">
      <button 
        onClick={handleLogin}
        className="relative bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-[8px_8px_16px_#b8bcc6,-8px_-8px_16px_#ffffff] transition-all hover:shadow-[inset_4px_4px_8px_#b8bcc6,inset_-4px_-4px_8px_#ffffff] active:shadow-[inset_6px_6px_12px_#b8bcc6,inset_-6px_-6px_12px_#ffffff]"
      >
        Login with Spotify
      </button>

    </div>

    )
  } else {
    return (
      <div>
          <Header setCurrentPage={setCurrentPage} currentPage={currentPage}/>
          {currentPage === 'SongPage' && (
          <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                  <SongPage user={user}/>
              </motion.div>
            </AnimatePresence>
          )}
           {currentPage === 'ArtistPage' && (
          <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                  <ArtistPage user={user}/>
              </motion.div>
            </AnimatePresence>
          )}
      </div>
      

    )
  }
}
