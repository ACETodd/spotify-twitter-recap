import React, {useState, useEffect} from 'react';
import { Play, Pause, SkipBack, SkipForward, ChevronUp, ChevronDown } from 'lucide-react';

export default function PlayerWheel({skipForwardRef, skipBackRef, handleNextTerm, handlePrevTerm, clickArtist, skipForwardFunction, skipBackFunction}) {
  const [isPressed, setIsPressed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Mobile handlers
  const handleTouchStart = () => setIsPressed(true);
  const handleTouchEnd = () => {
    if (isMobile) {
      setIsPressed(false);
      clickArtist();
    }
   
  };
  
  // Desktop handler - single click behavior
  const handleClick = () => {
    if (!isMobile) {
      setIsPressed(true);
      clickArtist();
      
      // Reset pressed state after a short delay for visual feedback
      setTimeout(() => {
        setIsPressed(false);
      }, 300);
    }
  };
  
  const buttonStyle = "w-12 h-12 flex items-center justify-center text-gray-600 font-bold";
  // Base styles
  const baseStyle = "w-24 h-24 rounded-full bg-gray-300 cursor-pointer transition-all duration-150";
  
  // Normal state (raised)
  const normalShadow = "shadow-[inset_6px_6px_12px_#b8b8b8,inset_-6px_-6px_12px_#ffffff]";
   
  // Pressed state (depressed)
  const pressedShadow = "shadow-[inset_7px_7px_12px_#a8a8a8,inset_-3px_-3px_6px_#f0f0f0] scale-95";

  return (
    <div className='justify-center items-center flex'>
      <div className="relative w-48 h-48">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 shadow-[10px_10px_20px_#b8b8b8,-10px_-10px_20px_#ffffff] flex items-center justify-center">
          <div 
            className={`${baseStyle} ${isPressed ? pressedShadow : normalShadow}`}
            onClick={handleClick}
            onTouchStart={isMobile ? handleTouchStart : undefined}
            onTouchEnd={isMobile ? handleTouchEnd : undefined}
            onTouchCancel={isMobile ? () => setIsPressed(false) : undefined}
          />
        
          <button className={`${buttonStyle} absolute top-2 left-1/2 transform -translate-x-1/2 pb-4 font-mono`}
            onClick={() => skipBackFunction()}
          >
            <ChevronUp size={20}/>
          </button>
          
          <button className={`${buttonStyle} absolute right-2 top-1/2 transform -translate-y-1/2 pl-4`}
            onClick={() => handleNextTerm()}
          >
            <SkipForward size={20}/>
          </button>
          
          <button className={`${buttonStyle} absolute bottom-2 left-1/2 transform -translate-x-1/2 pt-4`}
            onClick={() => skipForwardFunction()}
          >
            <ChevronDown size={20}/>
          </button>
          
          <button className={`${buttonStyle} absolute left-2 top-1/2 transform -translate-y-1/2 pr-4`}
            onClick={() => handlePrevTerm()}
          >
            <SkipBack size={20}/>
          </button>
        </div>
      </div>
    </div>
  );
}