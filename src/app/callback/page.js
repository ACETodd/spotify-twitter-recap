"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TypeAnimation } from "react-type-animation";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
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

  useEffect(() => {
    if (code) {
      fetch(`http://192.168.1.72:8000/callback?code=${code}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Origin: "http://localhost:3000/",
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
            console.log("Missing expires", data);
          }
          localStorage.setItem("spotifyUser", JSON.stringify(data));
          setTimeout(() => router.push("/"), 5000);
        })
        .catch((error) => {
          console.error("Login error:", error);
          router.push("/");
        });
    }
  }, [code, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center text-xl mb-4 text-black font-mono">
        <TypeAnimation sequence={["Logging in to Spotify...", 300]} repeat={Infinity} />
      </div>
    </div>
  );
}

export default function Callback() {
  return <CallbackContent />;
}
