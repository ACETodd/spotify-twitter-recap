import React from 'react'

export default function ArtistDesc({selectedArtist}) {

  const artistName = selectedArtist ? selectedArtist.name : 'Select an Artist'
  const artistGenre = selectedArtist ? selectedArtist.genres.join(', ') : 'Select an Artist'
  const artistFollowers = selectedArtist ? selectedArtist.followers.total.toLocaleString() : 'Select an Artist'
  const artistPopularity = selectedArtist ? (selectedArtist.popularity / 10).toFixed(1) : 'Select an Artist';

  return (
    <div className='font-mono p-2 flex flex-col'>
        <div className='font-semibold'>{artistName}</div>
        <div className=''>Genres: {artistGenre}</div>
        <div className=''>Followers: {artistFollowers}</div>
        <div className=''>Popularity: {artistPopularity}/10</div>
    </div>
  )
}
