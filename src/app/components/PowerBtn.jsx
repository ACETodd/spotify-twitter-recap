import React, {useState} from 'react'
import { Power } from 'lucide-react';

export default function PowerBtn({setCurrentPage}) {

  const [isPressed, setIsPressed] = useState(false);

  const btnPressed = () => {
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 120);
  }
    
  return (
    <div className="flex items-center justify-center">
      <div
        className="p-4 rounded-full bg-gray-200
        flex items-center justify-center cursor-pointer w-10 h-10"
        style={{
          boxShadow: isPressed
            ? 'inset -4px -4px 8px #b8b8b8, inset 4px 4px 8px #ffffff'
            : 'inset -2px -2px 5px #b8b8b8, inset 2px 2px 5px #ffffff',
          transition: 'all 0.1s ease-in-out',
          transform: isPressed ? 'scale(0.97)' : 'scale(1)'
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => {
          setIsPressed(false);
          btnPressed();
        }}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => {
          setIsPressed(false);
          btnPressed();
        }}
      >
        <div
          style={{
            transform: isPressed ? 'scale(0.92)' : 'scale(1)',
            opacity: isPressed ? 0.75 : 1,
            transition: 'all 0s ease-in'
          }}
        >
          <Power size={16} className="text-gray-500" />
        </div>
      </div>
    </div>
  )
}
