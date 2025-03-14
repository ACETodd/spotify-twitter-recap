import React, {useRef, useState, useEffect} from 'react'
import PowerBtn from './PowerBtn'
import PlayerScreen from './PlayerScreen'
import {Pause, Play, SkipForward, SkipBack} from 'lucide-react'
import PlayerWheel from './PlayerWheel'
import { FadeLoader } from 'react-spinners'
import HeadphoneJack from './HeadphoneJack'
import { motion } from 'framer-motion';

export default function Player({user, setSelectedArtist, selectedArtist}) {
    const skipForwardRef = useRef(null)
    const skipBackRef = useRef(null)
    const [songTerm, setSongTerm] = useState('short');
    const [direction, setDirection] = useState(0);
    const terms = ["short", "medium", "long"];
    const [loading, setLoading] = useState(true);
    const [artistScreen, setArtistScreen] = useState(null)
    const [transitionOut, setTransitionOut] = useState(false)
    const [isVisible, setIsVisible] = useState(false);
  
    const handleSkipForwardRef = (skipForwardFn) => {
        skipForwardRef.current = skipForwardFn;
    };
      
    const handleSkipBackRef = (skipBackFn) => {
        skipBackRef.current = skipBackFn;
    };

    const skipBackFunction = () => {
      if (!artistScreen) {
        skipBackRef.current && skipBackRef.current()
      }
    }

    const skipForwardFunction = () => {
      if (!artistScreen) {
        skipForwardRef.current && skipForwardRef.current()
      }
    }
    
    
    const handleNextTerm = () => {
      if (!artistScreen) {
        const currentIndex = terms.indexOf(songTerm);
        const nextIndex = (currentIndex + 1) % terms.length;
        setDirection(1); // Sliding from right to left
        setSongTerm(terms[nextIndex]);
      }
      
    };

    // Function to cycle to the previous term
    const handlePrevTerm = () => {
      if (!artistScreen) {
        const currentIndex = terms.indexOf(songTerm);
        const prevIndex = (currentIndex - 1 + terms.length) % terms.length;
        setDirection(-1); // Sliding from left to right
        setSongTerm(terms[prevIndex]);
      } else {
        console.log('artistScreen was', artistScreen)
        //go back to song selection screen
        setArtistScreen(null)
        console.log('artistScreen is', artistScreen)
        setTransitionOut(true)
      }
    };

    const clickArtist = () => {
        if (selectedArtist) {
            setArtistScreen(selectedArtist)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
          setIsVisible(true);
          setLoading(false);

        }, 1500); 
        
    
        return () => clearTimeout(timer);
    }, []);
      
    return (
      <div className="relative">
      {/* Headphone jack positioned behind with negative z-index */}
      
      <div className='rounded-3xl bg-gradient-to-tr from-gray-200 to-gray-300 w-80 sm:w-96 h-[500px] pt-1 z-20 relative'
          style={{
              boxShadow: '12px 12px 24px #b8b8b8, -4px -4px 10px #ffffff, inset 2px 2px 5px rgba(255, 255, 255, 0.7), inset -2px -2px 5px rgba(184, 184, 184, 0.3)'
          }}
      >
          <div className='border-x-[8px] border-t-[8px] border-b-[8px] border-black m-4 rounded-lg h-1/2'>
              {!loading ? (
                  <PlayerScreen 
                      user={user}
                      onSkipForward={handleSkipForwardRef} 
                      onSkipBack={handleSkipBackRef} 
                      selectedArtist={selectedArtist}
                      setSelectedArtist={setSelectedArtist}
                      direction={direction}
                      songTerm={songTerm}
                      artistScreen={artistScreen}
                      transitionOut={transitionOut}
                  />
              ) : (
                  <div className='bg-black h-[234px] flex items-center justify-center'>
                      <div className='ml-6 mt-6'>
                          <FadeLoader
                              height={4}
                              radius={10}
                              margin={-10}
                              width={2.5}
                              color={'white'}
                          />
                      </div>
                  </div>
              )}
          </div>     

          <PlayerWheel
              handleNextTerm={handleNextTerm}
              handlePrevTerm={handlePrevTerm}
              skipBackRef={skipBackRef}
              skipForwardRef={skipForwardRef}
              clickArtist={clickArtist}
              skipBackFunction={skipBackFunction}
              skipForwardFunction={skipForwardFunction}

          />
      </div>
      <motion.div 
      className="fixed  z-10 mt-6 sm:ml-80 ml-64"
      initial={{ y: 100, opacity: 0 }} // Start from below and invisible
      animate={{ 
        y: isVisible ? -80 : 100, // Move to final position when visible
        opacity: isVisible ? 1 : 0
      }}
      transition={{ 
        type: "spring", 
        stiffness: 120, 
        damping: 20,
        delay: 0.2
      }}
    >
      <HeadphoneJack />
    </motion.div>
  </div>
    )
}