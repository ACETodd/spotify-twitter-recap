import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RecentTracks from "./RecentTracks";

export default function Carousel() {

  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenExpiry, setTokenExpiry] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('spotifyUser');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setAccessToken(parsedData.access_token);
        setRefreshToken(parsedData.refresh_token);
        
        // Set token expiry if it exists, otherwise calculate it
        if (parsedData.expires_at) {
          setTokenExpiry(parseInt(parsedData.expires_at));
        } else if (parsedData.expires_in) {
          const expiryTime = Date.now() + (parsedData.expires_in * 1000);
          setTokenExpiry(expiryTime);
          
          // Update localStorage with expiry time
          parsedData.expires_at = expiryTime.toString();
          localStorage.setItem('spotifyUser', JSON.stringify(parsedData));
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const refreshAccessToken = async () => {
    if (!refreshToken || refreshing) return false;
    
    setRefreshing(true);
    try {
      console.log("Refreshing access token...");
      const response = await fetch('http://localhost:8000/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000'
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to refresh token: ${response.status} ${response.statusText}`);
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
      return true;
    } catch (err) {
      console.error('Error refreshing token:', err);
      setRefreshing(false);
      return false;
    }
  };

  const checkAndRefreshToken = async () => {
    // If token is expired or about to expire in the next 5 minutes (300000 ms)
    if (tokenExpiry && Date.now() > tokenExpiry - 300000) {
      console.log('Token expired or about to expire, refreshing...');
      return await refreshAccessToken();
    }
    return true;
  };

  const fetchRecentlyPlayed = async () => {
    if (!accessToken) return;
    
    // Check token validity before making the request
    const isTokenValid = await checkAndRefreshToken();
    if (!isTokenValid) {
      console.error('Could not refresh token');
      return;
    }
    
    try {
      const response = await fetch(
        `http://localhost:8000/recently-played?access_token=${accessToken}`,
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
          // Retry the request with new token
          return fetchRecentlyPlayed();
        } else {
          throw new Error('Unable to refresh token');
        }
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('recently played', data);
      
      // Make sure we have items before mapping
      const tracksArray = data.items ? data.items.map(item => item.track) : [];
      console.log('Processed tracks:', tracksArray);
    
      setTracks(tracksArray);     
      setIsLoading(false);  
    } catch (err) {
      console.error('Error fetching recently played:', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      // Initial fetch
      fetchRecentlyPlayed();
      
      // Setup periodic refresh of data and token check
      // const dataInterval = setInterval(fetchRecentlyPlayed, 30000); 
      
      // Token check interval (every 5 minutes)
      const tokenInterval = setInterval(checkAndRefreshToken, 300000); // Every 5 minutes
      
      return () => {
        // clearInterval(dataInterval);
        clearInterval(tokenInterval);
      };
    }
  }, [accessToken]);

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
            <p className="text-gray-500">No recently played tracks found.</p>
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
  )
}
