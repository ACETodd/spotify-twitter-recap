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
    <div className='flex flex-col'>
      <div className={"relative overflow-hidden w-fit p-4 px-12"}>
        <div className='flex space-x-4 justify-between mb-4'>
          <div className='font-mono text-white'>Top Artists - recent</div>
          <div className='font-mono text-white truncate max-w-sm'>{hoveredArtist ? `#${hoveredArtist.rank} - ${hoveredArtist.name}` : "Hover over an artist"}</div>
        </div>
        <div className="flex flex-row items-center justify-center">
          {getArtists('short').map((item, index) => (
            <motion.div 
              key={item.id || index}
              onMouseEnter={() => setHoveredArtist({ name: item.name, rank: index + 1 })}
              onMouseLeave={() => setHoveredArtist(null)}
              className="flex-shrink-0 -ml-5 first:ml-0 relative z-10 hover:z-20"
              whileHover={{
                translateY: -5,
                scale: 1.2,
                boxShadow: "0 0 20px -4px rgba(0,0,0,0.5)",
              }}
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
      <div className={"relative overflow-hidden w-fit p-4 px-12"}>
        <div className='flex space-x-4 justify-between mb-4'>
          <div className='font-mono text-white'>Top Artists - 6 Months</div>
          <div className='font-mono text-white truncate max-w-sm'>{hoveredArtistMedium ? `#${hoveredArtistMedium.rank} - ${hoveredArtistMedium.name}` : "Hover over an artist"}</div>
        </div>
        <div className="flex flex-row items-center justify-center">
          {getArtists('medium').map((item, index) => (
            <motion.div 
              key={item.id || index}
              onMouseEnter={() => setHoveredArtistMedium({ name: item.name, rank: index + 1 })}
              onMouseLeave={() => setHoveredArtistMedium(null)}
              className="flex-shrink-0 -ml-5 first:ml-0 relative z-10 hover:z-20"
              whileHover={{
                translateY: -5,
                scale: 1.2,
                boxShadow: "0 0 20px -4px rgba(0,0,0,0.5)",
              }}
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
      <div className={"relative overflow-hidden w-fit p-4 px-12"}>
        <div className='flex space-x-4 justify-between mb-4'>
          <div className='font-mono text-white'>Top Artists - Past Year</div>
          <div className='font-mono text-white truncate max-w-sm'>{hoveredArtistLong ? `#${hoveredArtistLong.rank} - ${hoveredArtistLong.name}` : "Hover over an artist"}</div>
        </div>
        <div className="flex flex-row items-center justify-center">
          {getArtists('long').map((item, index) => (
            <motion.div 
              key={item.id || index}
              onMouseEnter={() => setHoveredArtistLong({ name: item.name, rank: index + 1 })}
              onMouseLeave={() => setHoveredArtistLong(null)}
              className="flex-shrink-0 -ml-5 first:ml-0 relative z-10 hover:z-20"
              whileHover={{
                translateY: -5,
                scale: 1.2,
                boxShadow: "0 0 20px -4px rgba(0,0,0,0.5)",
              }}
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
    

  )
}
