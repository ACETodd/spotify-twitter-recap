"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TypeAnimation } from "react-type-animation";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      fetch(`https://spotify-advanced-analytics.onrender.com/callback?code=${code}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Origin: "http://localhost:3000",
        },
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Login successful:", data);
          if (data.expires_in && !data.expires_at) {
            data.expires_at = (Date.now() + data.expires_in * 1000).toString();
          } else {
            console.log("missing expires", data);
          }
          localStorage.setItem("spotifyUser", JSON.stringify(data));
          router.push("/");
        })
        .catch((error) => {
          console.error("Login error:", error);
          router.push("/");
        });
    }
  }, [code, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center text-xl mb-4 text-white font-mono">
        <TypeAnimation sequence={["Logging in to Spotify...", 300]} repeat={Infinity} />
      </div>
    </div>
  );
}

export default function Callback() {
  return (
    <Suspense fallback={<div className="text-white text-center">Loading...?</div>}>
      <CallbackContent />
    </Suspense>
  );
}
