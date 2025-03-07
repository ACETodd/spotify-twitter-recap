import React from 'react'
import { TypeAnimation } from "react-type-animation";

export default function NeuDesc({currentTrack, currentTrackIndex}) {

  const releaseDate = currentTrack?.album?.release_date || '';
  const rank = currentTrackIndex + 1 || '';
  const trackName = currentTrack?.name || 'No Track Selected';
  const artistName = currentTrack?.artists?.map(artist => artist.name).join(', ') || '';
  const albumName = currentTrack?.album?.name || '';
  const runTime = currentTrack?.duration_ms 
    ? `${Math.floor(currentTrack.duration_ms / 60000)}:${String(Math.floor((currentTrack.duration_ms % 60000) / 1000)).padStart(2, '0')}`
    : '';


  return (
    <div className='sm:px-0 px-4'>
       {/* <TypeAnimation
          sequence={[`#${rank}\n${trackName}\n${artistName}\n${albumName}\n{runTime}$`,1000]}          
          repeat={Infinity}
        /> */}
        <div className='font-mono font-semibold'>{`#${rank}`}</div>
        <div className='font-mono font-semibold'>{trackName}</div>
        <div className='font-mono'>{artistName}</div>
        <div className='font-mono'>{albumName}</div>
        {releaseDate && <div className='font-mono'>{`released ${releaseDate}`}</div>}
        <div className='font-mono'>{runTime}</div>

    </div>
  )
}
