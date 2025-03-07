import React, {useState, useEffect} from 'react'
import CD from './CD'
import SongCD from './SongCD'
import NeuHolderBtns from './NeuHolderBtns'
import { motion, AnimatePresence } from 'framer-motion'

export default function CDHolder({user, setCurrentTrack, setCurrentTrackIndex}) {

    const [songTerm, setSongTerm] = useState('short')
    const [isAnimating, setIsAnimating] = useState(false)
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 640);

    useEffect(() => {
      // Initial check
      setIsMobile(window.innerWidth < 640);
      
      const handleResize = () => {
        setIsMobile(window.innerWidth < 640);
      };
      
      // Throttle the resize event to improve performance
      let timeoutId;
      const throttledResize = () => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(handleResize, 100);
      };
      
      window.addEventListener('resize', throttledResize);
      return () => {
        window.removeEventListener('resize', throttledResize);
        if (timeoutId) clearTimeout(timeoutId);
      };
    }, []);


    const getArtists = (length) => {
        if (length === "medium") return user?.medium_term_tracks?.items || [];
        if (length === "short") return user?.short_term_tracks?.items || [];
        if (length === "long") return user?.long_term_tracks?.items || [];
        return [];
      };
    
    const getTitle = (length) => {
        if (length === "short") return 'Top Tracks - Recent';
        if (length === "medium") return 'Top Tracks - Past 6 Months'
        if (length === "long") return 'Top Tracks - Past Year'
        return [];
    }

    const getImageUrl = (item) => {
    if (item.album) {
        // This is a track
        return item.album?.images?.[1]?.url || "/api/placeholder/40/40";
    }
    // This is an artist
    return item.images?.[1]?.url || "/api/placeholder/40/40";
    };

    const handleCDClick = (track, index) => {
        setCurrentTrack(track); // Set the current track
        setCurrentTrackIndex(index)
        console.log('track', track)
      };

    const handleTermChange = (newTerm) => {
      if (isAnimating) return; // Prevent multiple animations

      setIsAnimating(true);
      
      // First, trigger the exit animation
      setSongTerm(newTerm);

      // Reset animation state after the animation completes
      setTimeout(() => {
          setIsAnimating(false);
      }, 500); // Match this with your animation duration
    };

    const containerVariants = {
    initial: (isMobile) => ({ 
        opacity: 1, 
        y: isMobile ? 0 : -500,
        x: isMobile ? -500 : 0
    }),
    exit: (isMobile) => ({ 
        opacity: 0, 
        y: isMobile ? 0 : 500,
        x: isMobile ? 500 : 0,
        transition: {
        duration: 0.3,
        ease: "easeIn"
        }
    }),
    enter: { 
        opacity: 1, 
        y: 0,
        x: 0,
        transition: {
        duration: 0.3,
        ease: "easeOut"
        }
    }
    };

  

  return (
    <div className='px-2 mt-12 sm:mt-0'>
    <NeuHolderBtns setSongTerm={handleTermChange} className="mt-4 sm:mt-0 bg-r"/>
    <div className="
        /* Mobile (default): horizontal layout at the top */
        w-full h-[125px] mt-4 
        rounded-full bg-gray-200 
        shadow-[inset_8px_8px_16px_#b8bcc6,inset_-8px_-8px_16px_#ffffff] 
        flex flex-row items-center justify-center pl-44
        py-4 overflow-x-auto overflow-y-hidden
        
        /* Desktop: vertical layout on the left */
        sm:absolute sm:left-10 sm:top-1/2 sm:-translate-y-1/2 
        sm:w-[150px] sm:h-[500px] sm:mt-0 sm:justify-start sm:pl-0
        sm:flex-col sm:overflow-y-hidden sm:overflow-x-hidden"
    >
        <AnimatePresence mode="wait">
        <motion.div 
            key={songTerm}
            custom={isMobile}
            variants={containerVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="flex flex-row sm:flex-col items-center"
            
        >
            {getArtists(songTerm).map((item, index) => (
            <div key={`${songTerm}-${index}`} className=" mb-24 mx-6 sm:mx-0 sm:mb-10 flex-shrink-0"
            style={{ transform: 'translateX(0)' }} // Ensures each CD has its own space

            >
                <CD 
                albumImage={getImageUrl(item)} 
                track={item.name} 
                onClick={() => handleCDClick(item, index)}
                />
            </div>
            ))}
        
        </motion.div>
        </AnimatePresence>
    </div>
    <div className='sm:hidden block font-mono font-semibold text-center pt-8'>{getTitle(songTerm)}</div>
</div>
   
  )
}
