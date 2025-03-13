import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArtistSelectionScreen from './ArtistSelectionScreen';
import ArtistScreen from './ArtistScreen';

export default function PlayerScreen({user, onSkipForward, onSkipBack, selectedArtist, setSelectedArtist, direction, songTerm, artistScreen, transitionOut}) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    // Add a state to control animation sequence
    const [isAnimating, setIsAnimating] = useState(false);
    const userTime = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

    const scrollContainerRef = useRef(null);
    const itemRefs = useRef([]);

    const getArtists = (length) => {
        if (length === "medium") return user?.medium_term?.items || [];
        if (length === "short") return user?.short_term?.items || [];
        if (length === "long") return user?.long_term?.items || [];
        return [];
    };

    const artists = getArtists(songTerm);

    // Initialize itemRefs with the correct length
    useEffect(() => {
        itemRefs.current = itemRefs.current.slice(0, artists.length);
    }, [artists]);

    const handleArtistClick = (artist, index) => {
        setSelectedArtist(artist);
        setSelectedIndex(index);
    };

    // Skip to the next artist
    const handleSkipForward = () => {
        if (artists.length > 0 && selectedIndex < artists.length - 1) {
            const nextIndex = selectedIndex + 1;
            setSelectedIndex(nextIndex);
            setSelectedArtist(artists[nextIndex]);
        }
    };

    // Skip to the previous artist
    const handleSkipBack = () => {
        if (artists.length > 0 && selectedIndex > 0) {
            const prevIndex = selectedIndex - 1;
            setSelectedIndex(prevIndex);
            setSelectedArtist(artists[prevIndex]);
        }
    };

    // Connect the external skip handlers to the local functions
    useEffect(() => {
        if (onSkipForward) {
            onSkipForward(handleSkipForward);
        }
        if (onSkipBack) {
            onSkipBack(handleSkipBack);
        }
    }, [selectedIndex, artists]);

    // Set the first artist as selected when the component mounts
    useEffect(() => {
        const currentArtists = getArtists(songTerm);
        if (currentArtists.length > 0) {
            setSelectedArtist(currentArtists[0]);
            setSelectedIndex(0);
        }
    }, [songTerm, user]);

    // Track when artist screen changes to control animation
    useEffect(() => {
        if (artistScreen !== null) {
            setIsAnimating(true);
            // Reset after animation completes
            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 600); // Slightly longer than animation duration
            return () => clearTimeout(timer);
        }
    }, [artistScreen]);

    

    // Scroll to keep the selected item visible
    useEffect(() => {
        if (selectedIndex >= 0 && itemRefs.current[selectedIndex] && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const selectedItem = itemRefs.current[selectedIndex];
            
            // Get positions
            const containerRect = container.getBoundingClientRect();
            const itemRect = selectedItem.getBoundingClientRect();

            // Check if the item is not fully visible
            if (itemRect.bottom > containerRect.bottom) {
                // If below the visible area, scroll down
                container.scrollTop += (itemRect.bottom - containerRect.bottom);
            } else if (itemRect.top < containerRect.top) {
                // If above the visible area, scroll up
                container.scrollTop -= (containerRect.top - itemRect.top);
            }
        }
    }, [selectedIndex]);

    const slideVariants = {
      enter: (direction) => ({
          x: direction > 0 ? "100%" : "-100%",
          opacity: 0,
          transition: { duration: 0.2, ease: "easeInOut" }
      }),
      center: {
          x: 0,
          opacity: 1,
          zIndex: 1,
          transition: { duration: 0.2, ease: "easeInOut" }
      },
      exit: (direction) => ({
          x: direction < 0 ? "100%" : "-100%",
          opacity: 0,
          transition: { duration: 0.2, ease: "easeInOut" }
      })
    };
  
    return (
        <div className="relative">
                <div className="w-full h-5 absolute top-0 z-20 bg-gradient-to-b from-gray-100 to-gray-300 shadow-[inset_0_2px_3px_rgba(255,255,255,0.9),inset_0_-2px_2px_rgba(0,0,0,0.1)] flex justify-between border-gray-200">
                <div className='font-sans font-semibold text-xs pl-1 pt-[2px]'>{userTime}</div>
                <div className="relative w-6 h-3 bg-gradient-to-b from-gray-300 to-gray-500 rounded-sm shadow-[inset_0_2px_2px_rgba(255,255,255,0.6),inset_0_-2px_2px_rgba(0,0,0,0.3)] border border-gray-400 flex items-center mt-[4px] mr-2">
                    <div className="w-2/3 h-full bg-gradient-to-b from-green-400 to-green-600 rounded-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),inset_0_-1px_1px_rgba(0,0,0,0.3)]"></div>
                    <div className="absolute right-[-4px] top-[25%] w-[2px] h-[50%] bg-gray-400 rounded-r-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-1px_1px_rgba(0,0,0,0.3)]"></div>
                </div>
                </div>
            <AnimatePresence>
                {(!artistScreen || isAnimating) && (
                    <motion.div
                        key="selection-screen"
                       
                        className="absolute top-0 left-0 w-full z-10"
                    >
                        <ArtistSelectionScreen
                            scrollContainerRef={scrollContainerRef}
                            direction={direction}
                            songTerm={songTerm}
                            slideVariants={slideVariants}
                            selectedIndex={selectedIndex}
                            selectedArtist={selectedArtist}
                            artists={artists}
                            itemRefs={itemRefs}
                            artistScreen={artistScreen}
                            handleArtistClick={handleArtistClick}
                            isAnimating={isAnimating}
                            transitionOut={transitionOut}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {artistScreen && (
                    <motion.div
                        key="artist-detail-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0, duration: 0.4 }}
                        className="w-full"
                    >
                        <ArtistScreen selectedArtist={selectedArtist} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}