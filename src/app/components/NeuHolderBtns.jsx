import React, { useState } from 'react'
import { Music, Music2, Music3 } from 'lucide-react';

export default function NeuHolderBtns({ setSongTerm }) {
  const [expandedTerm, setExpandedTerm] = useState(null);

  const handleClick = (term) => {
    setSongTerm(term);
    // Only set expandedTerm on larger screens
    if (window.innerWidth >= 640) { // sm breakpoint is 640px in Tailwind
      setExpandedTerm(term === expandedTerm ? null : term);
    }
  };

  const buttonDetails = {
    'short': { text: 'Recent', icon: <Music3 size={22}/> },
    'medium': { text: '6 Months', icon: <Music2 size={22}/> },
    'long': { text: 'Past Year', icon: <Music size={22}/> }
  };

  return (
    <div className='sm:ml-[200px] flex flex-row sm:flex-col items-start p-2 sm:space-y-4 align-center justify-center space-x-4 sm:space-x-0'>
      {Object.entries(buttonDetails).map(([term, { text, icon }]) => (
        <div 
          key={term} 
          className="group relative" 
          onClick={() => handleClick(term)}
        >
          <div className={`
            flex items-center justify-start overflow-hidden
            ${expandedTerm === term && window.innerWidth >= 640 ? 'w-full' : 'sm:w-11 sm:group-hover:w-full w-11'} 
            h-11 rounded-full bg-gray-200 px-[6px]
            shadow-[8px_8px_16px_#b8bcc6,-8px_-8px_16px_#ffffff] 
            active:shadow-[inset_8px_8px_16px_#b8bcc6,inset_-8px_-8px_16px_#ffffff] 
            text-gray-600 select-none cursor-pointer 
            transition-all duration-300 ease-in-out sm:transition-all sm:duration-300 sm:ease-in-out transition-none`}>
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-lg font-semibold">
              {icon}
            </div>
            <div className={`
              px-4 whitespace-nowrap hidden sm:block
              ${expandedTerm === term ? 'sm:opacity-100' : 'sm:opacity-0 sm:group-hover:sm:opacity-100'} 
              sm:transition-opacity sm:duration-300 font-mono
            `}>
              {text}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}