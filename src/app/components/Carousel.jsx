import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import RecentTracks from "./RecentTracks";

export default function Carousel({ user }) {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenExpiry, setTokenExpiry] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshAttempts, setRefreshAttempts] = useState(0);

  // Initialize from user prop
  useEffect(() => {
    if (user && user.access_token) {
      setAccessToken(user.access_token);
      setRefreshToken(user.refresh_token);
      
      // Set token expiry
      if (user.expires_at) {
        setTokenExpiry(parseInt(user.expires_at));
      } else if (user.expires_in) {
        const expiryTime = Date.now() + (user.expires_in * 1000);
        setTokenExpiry(expiryTime);
        
        // Update localStorage with expiry time
        try {
          const userData = JSON.parse(localStorage.getItem('spotifyUser') || '{}');
          userData.expires_at = expiryTime.toString();
          localStorage.setItem('spotifyUser', JSON.stringify(userData));
        } catch (error) {
          console.error("Error updating localStorage:", error);
        }
      }
    } else {
      // No user data or token
      setIsLoading(false);
    }
  }, [user]);

  const refreshAccessToken = useCallback(async () => {
    // Limit refresh attempts to prevent infinite loops
    if (refreshAttempts >= 3) {
      console.error('Max refresh attempts reached');
      setIsLoading(false);
      return false;
    }

    if (!refreshToken || refreshing) return false;
    
    setRefreshing(true);
    setRefreshAttempts(prev => prev + 1);

    try {
      console.log("Refreshing access token...");
      const response = await fetch('https://spotify-advanced-analytics.onrender.com/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000'
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        console.error(`Token refresh failed: ${response.status}`);
        setRefreshing(false);
        setIsLoading(false);
        return false;
      }
      
      const data = await response.json();
      console.log("Token refreshed successfully");
      
      // Update tokens in state
      setAccessToken(data.access_token);
      
      // Spotify might return a new refresh token, so update it if present
      if (data.refresh_token) {
        setRefreshToken(data.refresh_token);
      }
      
      // Calculate and store new expiry time
      const expiryTime = Date.now() + (data.expires_in * 1000);
      setTokenExpiry(expiryTime);
      
      // Update localStorage
      try {
        const userData = JSON.parse(localStorage.getItem('spotifyUser') || '{}');
        userData.access_token = data.access_token;
        if (data.refresh_token) {
          userData.refresh_token = data.refresh_token;
        }
        userData.expires_at = expiryTime.toString();
        userData.expires_in = data.expires_in;
        localStorage.setItem('spotifyUser', JSON.stringify(userData));
      } catch (error) {
        console.error("Error updating localStorage after token refresh:", error);
      }
      
      setRefreshing(false);
      setRefreshAttempts(0);
      return true;
    } catch (err) {
      console.error('Error refreshing token:', err);
      setRefreshing(false);
      setIsLoading(false);
      return false;
    }
  }, [refreshToken, refreshing, refreshAttempts]);

  const checkAndRefreshToken = useCallback(async () => {
    // If no token expiry is set, assume token is valid (will be caught by API if invalid)
    if (!tokenExpiry) return accessToken ? true : false;
    
    // If token is expired or about to expire in the next 5 minutes (300000 ms)
    if (Date.now() > tokenExpiry - 300000) {
      console.log('Token expired or about to expire, refreshing...');
      return await refreshAccessToken();
    }
    
    return accessToken ? true : false;
  }, [accessToken, tokenExpiry, refreshAccessToken]);

  const fetchRecentlyPlayed = useCallback(async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }
    
    // Check token validity before making the request
    const isTokenValid = await checkAndRefreshToken();
    if (!isTokenValid) {
      console.error('Could not use/refresh token');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Fetching recently played tracks...');
      const response = await fetch(
        `https://spotify-advanced-analytics.onrender.com/recently-played?access_token=${accessToken}`,
        {
          headers: {
            'Accept': 'application/json',
            'Origin': 'http://localhost:3000'
          },
          credentials: 'include'
        }
      );
      
      if (response.status === 401) {
        console.log('Token expired during request, attempting to refresh...');
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          // Try one more time with the new token
          return fetchRecentlyPlayed();
        }
        
        console.error('Unable to refresh token after 401');
        setIsLoading(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Make sure we have items before mapping
      const tracksArray = data.items ? data.items.map(item => item.track) : [];
      console.log('Processed tracks:', tracksArray.length);
    
      setTracks(tracksArray);
    } catch (err) {
      console.error('Error fetching recently played:', err);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, checkAndRefreshToken, refreshAccessToken]);

  useEffect(() => {
    if (accessToken) {
      // Initial fetch
      fetchRecentlyPlayed();
      
      // Setup periodic token check and data refresh
      const refreshInterval = setInterval(() => {
        checkAndRefreshToken().then(valid => {
          if (valid) {
            fetchRecentlyPlayed();
          }
        });
      }, 300000); // Every 5 minutes
      
      return () => {
        clearInterval(refreshInterval);
      };
    }
  }, [accessToken, checkAndRefreshToken, fetchRecentlyPlayed]);
  // Only generate looped tracks if we have tracks to show
  const loopedTracks = tracks.length > 0 ? [...tracks, ...tracks, ...tracks, ...tracks] : [];
  
  if (isLoading) {
    return (
      <div className="overflow-hidden w-full">
        <div className="animate-pulse space-x-2 flex whitespace-nowrap">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="bg-gray-200 w-60 flex-shrink-0 h-12"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!isLoading && tracks.length === 0) {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <p className="text-gray-300">
          {refreshError ? "Authentication error. Please try logging in again." : "No recently played tracks found."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden w-full">
      <motion.div
        className="flex whitespace-nowrap space-x-2"
        animate={{
          x: [0, -tracks.length * 240], // Adjust multiplier based on item width
        }}
        transition={{
          duration: tracks.length * 5, // Adjust duration based on number of tracks
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {loopedTracks.map((item, index) => (
          <RecentTracks 
            key={`${item.id}-${index}`} 
            index={index} 
            item={item} 
          />
        ))}
      </motion.div>
    </div>
  );
}