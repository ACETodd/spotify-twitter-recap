const BACKEND = "https://framebackend.onrender.com";

export async function getValidAccessToken(user, setUser) {
  if (!user?.access_token) return null;

  const expiresAt = Number(user.expires_at || 0);
  const now = Date.now();

  // refresh 60s early
  const needsRefresh = !expiresAt || now > expiresAt - 60_000;

  if (!needsRefresh) return user.access_token;
  if (!user.refresh_token) return null;

  const res = await fetch(`${BACKEND}/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: user.refresh_token }),
  });

  if (!res.ok) return null;

  const tokenData = await res.json();

  const updated = {
    ...user,
    access_token: tokenData.access_token,
    expires_in: tokenData.expires_in,
    expires_at: Date.now() + tokenData.expires_in * 1000,
    // keep old refresh token (Spotify usually doesn’t return a new one)
    refresh_token: user.refresh_token,
  };

  setUser(updated);
  localStorage.setItem("spotifyUser", JSON.stringify(updated));

  return updated.access_token;
}
