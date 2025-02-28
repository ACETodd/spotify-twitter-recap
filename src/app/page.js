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

  return (
    <div>
      <Login user={user} onLogin={() => {}} />
    </div>
  );
}
