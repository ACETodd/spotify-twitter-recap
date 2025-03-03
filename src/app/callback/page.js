"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Callback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      fetch(`http://localhost:8000/callback?code=${code}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Origin': 'http://localhost:3000'
        },
        credentials: 'include'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log("Login successful:", data);
          if (data.expires_in && !data.expires_at) {
            data.expires_at = (Date.now() + data.expires_in * 1000).toString();
          } else {
            console.log('missing expires', data)
          }
          localStorage.setItem('spotifyUser', JSON.stringify(data));
          router.push("/");
        })
        .catch(error => {
          console.error("Login error:", error);
          router.push("/");
        });
    }
  }, [code, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl mb-4 text-white">Logging in to Spotify...</h1>
      </div>
    </div>
  );
}