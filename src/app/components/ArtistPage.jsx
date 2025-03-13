import React, {useState} from 'react'
import Player from './Player.jsx'
import ArtistDesc from './ArtistDesc.jsx'

export default function ArtistPage({user}) {
  const [selectedArtist, setSelectedArtist] = useState(null);

  return (
    <div className="max-h-screen sm:max-h-none sm:min-h-screen  flex justify-center items-center bg-gradient-to-br from-gray-200 to-gray-300 mt-28 sm:mt-0 overflow-y-hidden scrollbar-hide">
      <div className="flex flex-col sm:flex-row items-center">
        {/* Empty space on the right to balance the layout */}

        <div className={`'w-full sm:w-80 opacity-0'`}></div>
        {/* Player always in the center */}
          <Player 
            user={user} 
            selectedArtist={selectedArtist} 
            setSelectedArtist={setSelectedArtist}
          />
        
        
          {/* Artist description on the left - only visible when artist is selected */}
          <div className={`p-10 w-full sm:w-80 opacity-100`}>
        {/* {selectedArtist && <ArtistDesc selectedArtist={selectedArtist} />} */}
        </div>
      </div>
    </div>
  )
}