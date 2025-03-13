import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import ArtistScreen from './ArtistScreen';

export default function ArtistSelectionScreen({
  scrollContainerRef,
  direction,
  songTerm,
  slideVariants,
  selectedIndex,
  selectedArtist,
  artists,
  itemRefs,
  artistScreen,
  handleArtistClick,
  isAnimating,
  transitionOut
}) {
  // Define animation variants for the curtain effect
  const leftPanelVariants = {
    visible: { x: 0 },
    hidden: { x: "-100%" }
  };
  
  const rightPanelVariants = {
    visible: { x: 0 },
    hidden: { x: "100%" }
  };

  return (
    <div className='justify-center items-center flex font-mono overflow-hidden mt-5'>
      {/* Left panel - Artist list */}
      <motion.div 
        className={`relative w-1/2 h-[212px] mb-5 overflow-hidden ${artistScreen !== null ? "" : "shadow-[10px_0_20px_rgba(0,0,0,0.5)]"}`}
        variants={leftPanelVariants}
        initial={transitionOut ? "hidden" : "visible"}
        animate={artistScreen !== null ? "hidden" : "visible"}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 25,
          duration: 0.6 
        }}
      >
        <div className="bg-gradient-to-br from-[#dbe9f4] to-[#4aa3df] text-white font-bold py-2 pl-2 
        shadow-[inset_2px_2px_6px_rgba(255,255,255,0.6),inset_-2px_-2px_6px_rgba(0,0,0,0.2),0_4px_6px_rgba(0,0,0,0.1)] 
        transition-all flex justify-between items-center">
          {songTerm === 'short' ? 'Recent' : 
          songTerm === 'medium' ? 'Past 6 Months' : 
          songTerm === 'long' ? 'Past Year' : 'Artists'}
          <ChevronRight color='white'/>
        </div>
        
        <div 
          ref={scrollContainerRef}
          className="text-black bg-white font-bold h-[175px] overflow-y-auto scrollbar-hide relative"
        >
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            <motion.div
              key={songTerm}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className='bg-white text-black w-full absolute top-0 left-0 right-0 bottom-0'
            >
              {artists.map((artist, index) => (
                <div
                  key={index}
                  ref={el => itemRefs.current[index] = el}
                  className={`p-1 cursor-pointer ${
                    selectedIndex === index ? 'bg-blue-200 text-black' : 'bg-transparent'
                  }`}
                  onClick={() => handleArtistClick(artist, index)}
                >
                <span>{index + 1}. {''}{artist.name}</span>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Right panel - Artist image */}
      <motion.div 
        className='bg-white text-black w-1/2 h-[212px] mb-5'
        variants={rightPanelVariants}
        initial={transitionOut ? "hidden" : "visible"}
        animate={artistScreen !== null ? "hidden" : "visible"}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 25,
          duration: 0.6 
        }}
      >
        <AnimatePresence>
          {(artistScreen === null || isAnimating) && selectedArtist && selectedArtist.images[0] && (
            <motion.div 
              className="flex justify-center items-center h-[212px]"
              initial={{ opacity: 1 }}
              animate={{ opacity: artistScreen !== null ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              key="artist-preview"
            >
              <img 
                src={selectedArtist.images[0].url} 
                alt={selectedArtist.name} 
                className="h-full w-full object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Artist Screen */}
      <AnimatePresence>
        {artistScreen !== null && (
          <motion.div 
            className="absolute inset-0 w-full h-[234px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArtistScreen selectedArtist={selectedArtist} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}