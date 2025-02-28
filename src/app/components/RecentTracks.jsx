import React from 'react'

export default function RecentTracks({ index, item }) {
  return (
    <div className="w-60 flex-shrink-0 bg-gray-800">
      <div key={index} className="flex items-start justify-start space-x-2">
        <img
          src={item.album.images[2]?.url || "/api/placeholder/40/40"}
          alt={item.album.name}
          className="w-10 h-10"
        />
        <div className='flex items-left justify-center flex-col truncate w-full'>
          <p className="font-sans text-sm truncate w-full text-white">{item.name}</p>
          <p className="text-xs text-gray-400 font-mono">
            {item.artists.map(artist => artist.name).join(', ')}
          </p>
        </div>
      </div>
    </div>
  )
}
