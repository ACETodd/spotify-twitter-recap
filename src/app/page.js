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

  // const updateUser = (userData) => {
  //   setUser(userData);
  //   localStorage.setItem('spotifyUser', JSON.stringify(userData));
  // };

  const handleLogout = () => {
    localStorage.removeItem('spotifyUser');
    setUser(null);
  };

  return (
    <div className="bg-gradient-to-br from-gray-200 to-gray-300 min-h-screen">
      <Login user={user} onLogin={() => {}} handleLogout={() => handleLogout()} />
    </div>
  );
}
