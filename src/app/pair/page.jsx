'use client';
import { useEffect, useState } from "react";

export default function Pair() {
  const [frameId, setFrameId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [backendBase, setBackendBase] = useState("");

  useEffect(() => {
    setBackendBase("https://framebackend.onrender.com");
  }, []);


  useEffect(() => {
    // Get frame_id from URL params
    const params = new URLSearchParams(window.location.search);
    const id = params.get("frame_id");
    setFrameId(id);
  }, []);

  const handleLogin = () => {
    if (frameId) {
        // pass frame_id as state so backend can link
        console.log('YES PAIRING', frameId)
        window.location.href = `${backendBase}/login?state=${encodeURIComponent(frameId)}`;
    } else {
        // normal login (not pairing)
        console.log('NOT PAIRING', frameId)
        window.location.href = `${backendBase}/login`;
    }
  };

  if (!frameId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-200 to-gray-300">
        <p className="text-gray-700 text-lg font-medium">Invalid pairing link.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-200 to-gray-300">

      <button
        onClick={handleLogin}
        disabled={loading}
        className="relative bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-[8px_8px_16px_#b8bcc6,-8px_-8px_16px_#ffffff] transition-all hover:shadow-[inset_4px_4px_8px_#b8bcc6,inset_-4px_-4px_8px_#ffffff] active:shadow-[inset_6px_6px_12px_#b8bcc6,inset_-6px_-6px_12px_#ffffff]"
      >
        Login with Spotify
      </button>
    </div>
  );
}
