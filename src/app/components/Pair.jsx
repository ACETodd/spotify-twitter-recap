// Pair.jsx
import React from "react";
import { useState } from "react";

export default function Pair() {
  const params = new URLSearchParams(window.location.search);
  const frameId = params.get("frame_id");
  const [backendBase, setBackendBase] = useState("");

  useEffect(() => {
    // ✅ Only runs in browser
    const host = window.location.hostname;
    const base =
      host === "localhost"
        ? "http://192.168.1.72:8000"
        : `http://${host}:8000`;
    setBackendBase(base);
  }, []);

  const handleLogin = () => {
    // send the frame id through the "state" param to the backend so the backend can link tokens to the frame
    window.location.href = `${backendBase}/login?state=${encodeURIComponent(frameId)}`;
  };

  if (!frameId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Please open this page from the QR (no frame_id found).</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h2 className="text-xl mb-4">Pair with frame</h2>
      <div className="mb-4 text-sm">Frame ID: <code>{frameId}</code></div>
      <button onClick={handleLogin} className="px-6 py-3 rounded bg-green-600 text-white">
        Login with Spotify
      </button>
    </div>
  );
}
