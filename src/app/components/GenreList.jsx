import React from 'react'

export default function GenreList({user}) {

  const shortTermGenres = user.top_genres.short_term || {};
  const mediumTermGenres = user.top_genres.medium_term || {};
  const longTermGenres = user.top_genres.long_term || {};


  const sortedShortGenres = Object.entries(shortTermGenres)
    .sort((a, b) => b[1] - a[1]) // Sort descending by count
    .slice(0,5)

  const shortGenres = sortedShortGenres.map(([genre]) => genre);


  const sortedMediumGenres = Object.entries(mediumTermGenres)
    .sort((a, b) => b[1] - a[1]) // Sort descending by count
    .slice(0,5)

  const mediumGenres = sortedMediumGenres.map(([genre]) => genre);


  const sortedLongGenres = Object.entries(longTermGenres)
    .sort((a, b) => b[1] - a[1]) // Sort descending by count
    // .slice(0,5)

  const longGenres = sortedLongGenres.map(([genre]) => genre);

  return (
    <div className='bg-emerald-400 p-6 h-full'>
        <div className="font-sans text-lg font-bold my-2">Top Recent Genres</div>
        {
            shortGenres.map((genre, index) => (
                <div key={index} className='font-mono'>
                    {`${index + 1}. ${genre}`}
                </div>
            ))
        }
         <div className="font-sans text-lg font-bold my-2">Past Year Genres</div>
        {
            longGenres.map((genre, index) => (
                <div key={index} className='font-mono'>
                    {`${index + 1}. ${genre}`}
                </div>
            ))
        }
    </div>
  )
}
