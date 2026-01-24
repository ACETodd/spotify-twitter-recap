'use client'
import { useEffect, useState } from "react";
import Login from "./components/Login"

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if we have a token or user data in localStorage
    const storedUser = localStorage.getItem('spotifyUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSetUser = (userData) => {
    setUser(userData);
    localStorage.setItem('spotifyUser', JSON.stringify(userData));
  };
  // const updateUser = (userData) => {
  //   setUser(userData);
  //   localStorage.setItem('spotifyUser', JSON.stringify(userData));
  // };

  const handleLogout = () => {
    localStorage.removeItem('spotifyUser');
    localStorage.removeItem('frame_id');
    setUser(null);

    const params = new URLSearchParams(window.location.search);
    const isFrame = params.get('frame') === 'true' || window.location.pathname.includes('/frame');

    if (isFrame) {
      window.location.replace('/?frame=true'); // forces reload → QR
    } else {
      window.location.replace('/'); // main login
    }
  };



  return (
    <div className="bg-gradient-to-br from-gray-200 to-gray-300 min-h-screen">
      <Login user={user} onLogin={() => {}} handleLogout={() => handleLogout()} setUser={handleSetUser}/>
    </div>
  );
}
