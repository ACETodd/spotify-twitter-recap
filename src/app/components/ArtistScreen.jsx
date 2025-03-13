import React from 'react'

export default function ArtistScreen({selectedArtist}) {
    const artistName = selectedArtist ? selectedArtist.name : 'Select an Artist'
    const artistGenre = selectedArtist ? selectedArtist.genres.join(', ') : 'Select an Artist'
    const artistFollowers = selectedArtist ? selectedArtist.followers.total.toLocaleString() : 'Select an Artist'
    const artistPopularity = selectedArtist ? (selectedArtist.popularity / 10).toFixed(1) : 'Select an Artist';

  return (
    <div className='font-mono h-[232px] overflow-hidden bg-slate-50'>
        
      
    
        <div className='p-2 flex items-center flex-col mt-5 space-y-2 '>
        <div>
            <img 
                src={selectedArtist.images[0].url} 
                alt={selectedArtist.name} 
                className="h-24 w-24"
              />
        </div>
        <div className='text-sm '>
            <div className='font-semibold'>{artistName}</div>
            <div className=''>Genres: {artistGenre}</div>
            <div className=''>Followers: {artistFollowers}</div>
            <div className=''>Popularity: {artistPopularity}/10</div>
        </div>
        </div>
    </div>
  )
}
