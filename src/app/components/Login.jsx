import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import Header from './Header'
import SongPage from './SongPage'
import ArtistPage from './ArtistPage'
import { motion, AnimatePresence } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

export default function Login({ user, setUser, handleLogout }) {
  const [currentPage, setCurrentPage] = useState('SongPage');
  const [isFrame, setIsFrame] = useState(null);
  const [frameId, setFrameId] = useState(null);
  const [pairUrl, setPairUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [backendBase, setBackendBase] = useState("");

  useEffect(() => {
    setBackendBase("https://framebackend.onrender.com");
  }, []);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const frameQuery = params.get('frame');
    const frameIdQuery = params.get('frame_id');
    const pathIsFrame = window.location.pathname.includes('/frame');

    const runningAsFrame = frameQuery === 'true' || !!frameIdQuery || pathIsFrame;
    setIsFrame(runningAsFrame);

    if (runningAsFrame) {
      // persist or generate a frame id
      const existing = localStorage.getItem('frame_id') || frameIdQuery ||
        (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `frame-${Date.now()}`);
      localStorage.setItem('frame_id', existing);
      setFrameId(existing);
      const LAN_IP = "192.168.1.72";
      const pairOrigin = window.location.origin.includes("localhost")
        ? `http://${LAN_IP}:3000`
        : window.location.origin;

      setPairUrl(`${pairOrigin}/pair?frame_id=${existing}`);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isFrame && frameId) { 
      const check = async () => {
        try {
          const res = await fetch(`${backendBase}/frame-status?frame_id=${encodeURIComponent(frameId)}`);
          if (!res.ok) return;

          const data = await res.json();

          // ✅ If frame is linked and has a user, setUser
          if (data.linked && data.user) {
            if (!user) {
              setIsConnecting(true);
              setTimeout(() => {
                setUser(data.user);
                setIsConnecting(false);
              }, 1800);
              console.log("✅ Frame linked and user set:", data.user);
            }
          } 
          // ✅ If previously had a user but now unlinked → log out
          else if (user) {
            console.log("🚪 Frame unlinked, logging out...");
            localStorage.removeItem("spotifyUser");
            localStorage.removeItem("frame_id");
            setUser(null);

            // Force reload back to QR screen
            window.location.replace("/?frame=true");
          }
        } catch (err) {
          console.error("Frame poll error:", err);
        }
      };

      check();
      interval = setInterval(check, 3000);
    }

    return () => clearInterval(interval);
  }, [isFrame, user, frameId, setUser]);


  const handleLogin = () => {
    window.location.href = `${backendBase}/login`;
  };

  if (isConnecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
        <div className="text-center text-2xl mb-4 text-gray-800 font-mono">
          <TypeAnimation 
            sequence={["Connecting to Spotify...", 200]} 
            repeat={Infinity} 
          />
        </div>
      </div>
    );
  }

  if (isFrame === null) {
    // Still determining mode
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-200 to-gray-300">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    if (isFrame) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
          {/* QR code (uses public QR image API for prototype) */}
           {/* Neumorphic container for QR code */}
        <div 
          className="bg-gray-200 shadow-[inset_8px_8px_16px_#b8bcc6,inset_-8px_-8px_16px_#ffffff] flex items-center justify-center rounded-3xl p-8"
          style={{
            width: '280px',
            height: '280px',
          }}
        >
          {/* Inner frame with outset shadow for depth */}
          <div 
            className="bg-gray-200 shadow-[8px_8px_16px_#b8bcc6,-8px_-8px_16px_#ffffff] flex items-center justify-center rounded-2xl"
          >
            {/* QR code */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pairUrl)}`}
              alt="Pair QR"
              className="rounded-lg"
              style={{ width: 220, height: 220 }}
            />
          </div>
        </div>

          {/* <div className="mt-3 text-xs break-words text-center" style={{ maxWidth: 360 }}>
            Or open on your phone: <br/>
            <a className="underline" href={pairUrl}>{pairUrl}</a>
          </div> */}

        </div>
      );
    }
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
          {/* <Header setCurrentPage={setCurrentPage} currentPage={currentPage}/> */}
          {currentPage === 'SongPage' && (
          <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                  <SongPage user={user} setUser={setUser}/>
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
