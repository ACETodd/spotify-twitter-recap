import React, { useState, useEffect } from 'react';

export default function HeadphoneJack() {
    const [wirePoints, setWirePoints] = useState([]);

    
    useEffect(() => {
        const generateWirePoints = () => {
          // Starting point (connected to jack)
          const startX = 50;
          const startY = 0;
          
          // Generate a natural curve with some randomness
          const points = [
            [startX, startY],
            [startX - 20 + Math.random() * 10, startY + 30 + Math.random() * 10],
            [startX + 30 + Math.random() * 10, startY + 80 + Math.random() * 20],
            [startX - 10 + Math.random() * 20, startY + 130 + Math.random() * 20],
            [startX + 20 + Math.random() * 10, startY + 180 + Math.random() * 20],
            [startX, startY + 230]
          ];
          
          setWirePoints(points);
        };
        
        generateWirePoints();
        
        // Optional: Regenerate points periodically for animation effect
        // const interval = setInterval(generateWirePoints, 5000);
        
        // return () => clearInterval(interval);
      }, []);
      
      // Create SVG path from points
      const createWirePath = () => {
        if (wirePoints.length === 0) return "";
        
        let path = `M ${wirePoints[0][0]} ${wirePoints[0][1]}`;
        
        for (let i = 1; i < wirePoints.length - 2; i++) {
          const xc = (wirePoints[i][0] + wirePoints[i + 1][0]) / 2;
          const yc = (wirePoints[i][1] + wirePoints[i + 1][1]) / 2;
          path += ` Q ${wirePoints[i][0]} ${wirePoints[i][1]}, ${xc} ${yc}`;
        }
        
        path += ` Q ${wirePoints[wirePoints.length - 2][0]} ${wirePoints[wirePoints.length - 2][1]}, ${wirePoints[wirePoints.length - 1][0]} ${wirePoints[wirePoints.length - 1][1]}`;
        
        return path;
      };

  return (
    <div className="relative flex flex-col items-end mr-10">
        {/* Unified structure with connected components */}
        <div className="relative flex flex-col items-center">
          {/* Jack Rod (3.5mm connector) */}
          <div className="h-12 w-3 bg-gray-300 rounded-t-md ">
            {/* Jack Rings integrated with the rod */}
            <div className="absolute top-2 h-0.5 w-3 bg-gray-500 rounded shadow-[inset_1px_1px_1px_#9ca3af,_inset_-1px_-1px_1px_#d1d5db]"></div>
            <div className="absolute top-5 h-0.5 w-3 bg-gray-500 rounded shadow-[inset_1px_1px_1px_#9ca3af,_inset_-1px_-1px_1px_#d1d5db]"></div>
            <div className="absolute top-8 h-0.5 w-3 bg-gray-500 rounded shadow-[inset_1px_1px_1px_#9ca3af,_inset_-1px_-1px_1px_#d1d5db]"></div>
          </div>
          
          {/* Main Jack Base with proper neumorphic effects */}
          <div className="h-14 w-6 bg-gray-200 rounded-md  mt-0">
            {/* Inner shadow at the top to create connection appearance */}
            <div className="h-2 w-full bg-gray-200 rounded-t-md "></div>
          </div>
          
          {/* Wire Attachment - connected to the main jack base */}
          <div className="h-6 w-4 bg-gray-200 rounded-b-md  -mt-1">
            {/* Inner shadow at the top to create connection appearance */}
            <div className="h-2 w-full bg-gray-200 rounded-t-md "></div>
          </div>

          {/* Wire Using SVG */}
          <svg width="100" height="250" className="absolute top-[124px]">
            <defs>
              <linearGradient id="wireGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#333" />
                <stop offset="100%" stopColor="#555" />
              </linearGradient>
            </defs>
            <path
              d={createWirePath()}
              stroke="url(#wireGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
  )
}
