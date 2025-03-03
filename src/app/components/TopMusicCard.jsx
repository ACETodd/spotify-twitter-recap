import React, {useState} from 'react'
import { motion } from "framer-motion";
import CD from './CD';

export default function TopMusicCard({ user }) {

  const [hoveredArtist, setHoveredArtist] = useState(null)
  const [hoveredArtistMedium, setHoveredArtistMedium] = useState(null)
  const [hoveredArtistLong, setHoveredArtistLong] = useState(null)

  const getArtists = (length) => {
    if (length === "medium") return user?.medium_term_tracks?.items || [];
    if (length === "short") return user?.short_term_tracks?.items || [];
    if (length === "long") return user?.long_term_tracks?.items || [];
    return [];
  };

  const getImageUrl = (item) => {
    if (item.album) {
      // This is a track
      return item.album?.images?.[1]?.url || "/api/placeholder/40/40";
    }
    // This is an artist
    return item.images?.[1]?.url || "/api/placeholder/40/40";
  };

  return (
    <div className='flex flex-col  sm:w-[700px] mb-48 sm:mb-0'>
         <div className={"relative md:px-12"}>
           <div className='flex space-x-4 justify-between mb-4 px-4'>
             <div className='font-mono text-white'>Top Songs - recent</div>
             <div className='font-mono text-white truncate max-w-sm'>{hoveredArtist ? `#${hoveredArtist.rank} - ${hoveredArtist.name}` : "Hover over a song"}</div>
           </div>
           <div className="flex flex-row sm:justify-center px-14 sm:px-0 overflow-x-auto overflow-y-hidden h-40 pt-6 ">
             {getArtists('short').reverse().map((item, index) => (
              <motion.div 
                  key={item.id || index}
                  onMouseEnter={() => setHoveredArtist({ name: item.name, rank: index + 1 })}
                  onMouseLeave={() => setHoveredArtist(null)}
                  className="flex-shrink-0 ml-12 first:ml-0 relative"
                  style={{ 
                    zIndex: hoveredArtist?.name === item.name ? 999 : getArtists('short').length - index 
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
                 <CD albumImage={getImageUrl(item)}  track={item.name} />
               </motion.div>
             ))}
           </div>
         </div>
         <div className={"relative md:px-12"}>
           <div className='flex space-x-4 justify-between mb-4 px-4'>
             <div className='font-mono text-white'>Top Songs - 6 Months</div>
             <div className='font-mono text-white truncate max-w-sm'>{hoveredArtistMedium ? `#${hoveredArtistMedium.rank} - ${hoveredArtistMedium.name}` : "Hover over a song"}</div>
           </div>
           <div className="flex flex-row sm:justify-center px-14 sm:px-0 overflow-x-auto overflow-y-hidden h-40 pt-6 ">
             {getArtists('medium').reverse().map((item, index) => (
              <motion.div 
                  key={item.id || index}
                  onMouseEnter={() => setHoveredArtistMedium({ name: item.name, rank: index + 1 })}
                  onMouseLeave={() => setHoveredArtistMedium(null)}
                  className="flex-shrink-0 ml-12 first:ml-0 relative"
                  style={{ 
                    zIndex: hoveredArtistMedium?.name === item.name ? 999 : getArtists('medium').length - index 
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
                 <CD albumImage={getImageUrl(item)}  track={item.name} />
               </motion.div>
             ))}
           </div>
         </div>
         <div className={"relative md:px-12"}>
           <div className='flex space-x-4 justify-between mb-4 px-4 '>
             <div className='font-mono text-white'>Top Songs - Past Year</div>
             <div className='font-mono text-white truncate max-w-sm'>{hoveredArtistLong ? `#${hoveredArtistLong.rank} - ${hoveredArtistLong.name}` : "Hover over a song"}</div>
           </div>
           <div className="flex flex-row sm:justify-center px-14 sm:px-0 overflow-x-auto overflow-y-hidden h-40 pt-6 ">
             {getArtists('long').reverse().map((item, index) => (
              <motion.div 
                  key={item.id || index}
                  onMouseEnter={() => setHoveredArtistLong({ name: item.name, rank: index + 1 })}
                  onMouseLeave={() => setHoveredArtistLong(null)}
                  className="flex-shrink-0 ml-12 first:ml-0 relative"
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
                 <CD albumImage={getImageUrl(item)}  track={item.name} />
               </motion.div>
             ))}
           </div>
         </div>
       </div>
  )
}
