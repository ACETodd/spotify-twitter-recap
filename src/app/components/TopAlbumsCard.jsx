import React, {useState} from 'react'
import { motion } from "framer-motion";
import CD from './CD'

export default function TopAlbumsCard({ user }) {

  const [hoveredArtist, setHoveredArtist] = useState(null)
  const [hoveredArtistMedium, setHoveredArtistMedium] = useState(null)
  const [hoveredArtistLong, setHoveredArtistLong] = useState(null)


  const getArtists = (length) => {
    if (length === "medium") return user?.medium_term?.items || [];
    if (length === "short") return user?.short_term?.items || [];
    if (length === "long") return user?.long_term?.items || [];
    return [];
  };

  const getImageUrl = (item) => {
    if (item.album) {
      // This is a track
      return item.album?.images?.[2]?.url || "/api/placeholder/40/40";
    }
    // This is an artist
    return item.images?.[2]?.url || "/api/placeholder/40/40";
  };

  return (
    <div className='flex flex-col sm:w-1/2 sm:bg-gray-800 sm:pb-12 sm:pt-8 sm:rounded-sm '>
      <div className="relative w-full">
        <div className='flex sm:flex-row flex-col sm:space-x-4 justify-between p-4 sm:px-12'>
          <div className='font-mono text-white'>Top Artists - Recent</div>
          <div className='font-mono text-white truncate max-w-sm hidden sm:block'>{hoveredArtist ? `#${hoveredArtist.rank} - ${hoveredArtist.name}` : "Hover over an artist"}</div>
          <div className='font-mono text-white truncate max-w-sm sm:hidden'>{hoveredArtist ? `#${hoveredArtist.rank} - ${hoveredArtist.name}` : "Tap an artist"}</div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="flex flex-row items-center justify-center min-w-max px-6 py-4">
            {getArtists('short').map((item, index) => (
              <motion.div 
                key={item.id || index}
                onMouseEnter={() => setHoveredArtist({ name: item.name, rank: index + 1 })}
                onMouseLeave={() => setHoveredArtist(null)}
                className="flex-shrink-0 -ml-5 first:ml-0 relative"
                style={{ 
                  zIndex: hoveredArtist?.name === item.name ? 999 : getArtists('long').length - index 
                }}
                animate={{
                  translateY: hoveredArtist?.name === item.name ? -5 : 0,
                  scale: hoveredArtist?.name === item.name ? 1.2 : 1,
                  boxShadow: hoveredArtist?.name === item.name 
                    ? "0 0 20px -4px rgba(0,0,0,0.5)" 
                    : "0 0 0 0 rgba(0,0,0,0)"
                }}
                transition={{ duration: 0.2 }}
              >
                <img 
                  src={getImageUrl(item)} 
                  alt={item.name} 
                  className="w-24 h-24 border border-white" 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative w-full ">
        <div className='flex sm:flex-row flex-col sm:space-x-4 justify-between p-4 sm:px-12'>
          <div className='font-mono text-white'>Top Artists - 6 Months</div>
          <div className='font-mono text-white truncate max-w-sm hidden sm:block'>{hoveredArtistMedium ? `#${hoveredArtistMedium.rank} - ${hoveredArtistMedium.name}` : "Hover over an artist"}</div>
          <div className='font-mono text-white truncate max-w-sm sm:hidden'>{hoveredArtistMedium ? `#${hoveredArtistMedium.rank} - ${hoveredArtistMedium.name}` : "Tap an artist"}</div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="flex flex-row items-center justify-center min-w-max px-6 py-4">
            {getArtists('medium').map((item, index) => (
              <motion.div 
                key={item.id || index}
                onMouseEnter={() => setHoveredArtistMedium({ name: item.name, rank: index + 1 })}
                onMouseLeave={() => setHoveredArtistMedium(null)}
                className="flex-shrink-0 -ml-5 first:ml-0 relative"
                style={{ 
                  zIndex: hoveredArtistMedium?.name === item.name ? 999 : getArtists('long').length - index 
                }}
                animate={{
                  translateY: hoveredArtistMedium?.name === item.name ? -5 : 0,
                  scale: hoveredArtistMedium?.name === item.name ? 1.2 : 1,
                  boxShadow: hoveredArtistMedium?.name === item.name 
                    ? "0 0 20px -4px rgba(0,0,0,0.5)" 
                    : "0 0 0 0 rgba(0,0,0,0)"
                }}
                transition={{ duration: 0.2 }}
              >
                <img 
                  src={getImageUrl(item)} 
                  alt={item.name} 
                  className="w-24 h-24 border border-white" 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative w-full ">
        <div className='flex sm:flex-row flex-col sm:space-x-4 justify-between p-4 sm:px-12'>
          <div className='font-mono text-white'>Top Artists - Past Year</div>
          <div className='font-mono text-white truncate max-w-sm hidden sm:block'>{hoveredArtistLong ? `#${hoveredArtistLong.rank} - ${hoveredArtistLong.name}` : "Hover over an artist"}</div>
          <div className='font-mono text-white truncate max-w-sm sm:hidden'>{hoveredArtistLong ? `#${hoveredArtistLong.rank} - ${hoveredArtistLong.name}` : "Tap an artist"}</div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="flex flex-row items-center justify-center min-w-max px-6 py-4">
            {getArtists('long').map((item, index) => (
              <motion.div 
                key={item.id || index}
                onMouseEnter={() => setHoveredArtistLong({ name: item.name, rank: index + 1 })}
                onMouseLeave={() => setHoveredArtistLong(null)}
                className="flex-shrink-0 -ml-5 first:ml-0 relative"
                style={{ 
                  zIndex: hoveredArtistLong?.name === item.name ? 999 : getArtists('long').length - index 
                }}
                animate={{
                  translateY: hoveredArtistLong?.name === item.name ? -5 : 0,
                  scale: hoveredArtistLong?.name === item.name ? 1.2 : 1,
                  boxShadow: hoveredArtistLong?.name === item.name 
                    ? "0 0 20px -4px rgba(0,0,0,0.5)" 
                    : "0 0 0 0 rgba(0,0,0,0)"
                }}
                transition={{ duration: 0.2 }}
              >
                <img 
                  src={getImageUrl(item)} 
                  alt={item.name} 
                  className="w-24 h-24 border border-white" 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
    

  )
}
