import React, {useState} from 'react'
import PowerBtn from './PowerBtn'
import { motion } from 'framer-motion'

export default function Header({setCurrentPage, currentPage}) {

  const ArtistBtn = () => {
    const [isActive, setIsActive] = useState(false);
    
    // Define different variants for active and inactive states
    const variants = {
      active: {
        scale: 1.05,
        transition: {
          scale: { duration: 0.3 },
        }
      },
      inactive: {
        scale: 1,
        transition: {
          scale: { duration: 0.3 },
        }
      }
    };

    return (
      <motion.div
       animate={isActive ? "active" : "inactive"}
       variants={variants}
       onMouseEnter={() => setIsActive(true)}
       onMouseLeave={() => setIsActive(false)}
       style={{ willChange: "transform" }} // Optimize rendering

      >
          <div className='rounded-lg bg-gradient-to-tr from-gray-300 to-gray-300 w-10 h-[60px] pt-1 z-20 relative'
            style={{
              boxShadow: '4px 4px 12px #b8b8b8, -3px -3px 6px #ffffff, inset 1px 1px 3px rgba(255, 255, 255, 0.7), inset -1px -1px 3px rgba(184, 184, 184, 0.3)'
            }}
            >
            <div className='m-1'>
              <div className='bg-gray-500 h-[20px] flex items-center justify-center rounded-sm'></div>
            </div>
            <div className='justify-center items-center flex'>
              <div className="relative w-6 h-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 shadow-[2px_2px_4px_#cfcfcf,-2px_-2px_4px_#ffffff] flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-gray-300 shadow-[inset_6px_6px_12px_#b8b8b8,inset_-6px_-6px_12px_#ffffff] "
                  ></div>
                </div>
                </div>
            </div>
          </div>
      </motion.div>
      
    )
  }


  const SongBtn = () => {
    const [isActive, setIsActive] = useState(false);
    
    // Define different variants for active and inactive states
    const variants = {
      active: {
        scale: 1.05,
        boxShadow: "0 0 20px -4px rgba(0,0,0,0.5)",
        transition: {
          scale: { duration: 0.3 },
        }
      },
      inactive: {
        scale: 1,
        transition: {
          scale: { duration: 0.3 },
        }
      }
    };
    
    return (
      <motion.div 
        className="size-[50px] z-10 flex origin-center select-none items-center justify-center overflow-hidden border bg-gray-200 text-white"
        style={{ 
          borderRadius: "25px",
          background: `
            radial-gradient(circle at 50% 50%, 
              #ffffff 0%, 
              #d1d1d1 25%, 
              #a8a8a8 50%, 
              #808080 75%, 
              #cfcfcf 100%
            ), 
            conic-gradient(
              from 0deg, 
              rgba(255, 0, 255, 0.3) 0deg, 
              rgba(0, 255, 255, 0.3) 60deg, 
              rgba(255, 255, 0, 0.3) 120deg, 
              rgba(255, 0, 255, 0.3) 180deg, 
              rgba(0, 255, 255, 0.3) 240deg, 
              rgba(255, 255, 0, 0.3) 300deg, 
              rgba(255, 0, 255, 0.3) 360deg
            )
          `,
          backgroundBlendMode: "screen, overlay"
        }}
        animate={isActive ? "active" : "inactive"}
        variants={variants}
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
      >
        <div className="absolute inset-0 rounded-full overflow-hidden"></div>
        <div className="relative flex items-center justify-center w-full h-full">
          <div className="size-[48px] absolute rounded-full border-[0.05px] border-white bg-transparent opacity-35"></div>
          <div className="size-[16px] absolute rounded-full border-[0.25px] border-white backdrop-blur-sm"></div>
          <div className="size-[14px] absolute rounded-full border border-dotted border-gray-200/15"></div>
          <div className="size-[12.5px] absolute rounded-full border-[0.25px] border-white bg-[#c3c3c5] opacity-70"></div>
          <div className="size-[8.5px] absolute rounded-full bg-[#bdbabc]"></div>
          <div className="size-[7px] absolute rounded-full bg-[#cfcdcf]"></div>
          <div className="size-[6.5px] absolute rounded-full bg-[#e9e4ea]"></div>
          <div className="size-[6px] absolute rounded-full border-[0.25px] border-[#c8c7c5] bg-[#f5f5f5] shadow-[0_0_2.5px_-1px_rgba(0,0,0,0.30)_inset]"></div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className='flex flex-row-reverse items-center justify-between p-3 px-6 sm:fixed top-0 left-0 right-0 z-10'>
        {/* <PowerBtn setCurrentPage={setCurrentPage}/> */}
        <button 
        onClick={() => {setCurrentPage(prevPage => (prevPage === 'ArtistPage' ? 'SongPage' : 'ArtistPage'))}}
        title={currentPage === 'ArtistPage' ? 'Go to Top Songs' : 'Go to Top Artists'}  
        >
          {currentPage === 'ArtistPage' ? <SongBtn/>  : <ArtistBtn/>}
        </button>
        <div className='font-mono font-semibold text-xl '>
            {/* {currentPage} */}
        </div>
        <div className='font-mono font-semibold text-xl '>
                    {currentPage === 'ArtistPage' ? '[Music] // Top Artists'  :  '[Music] // Top Songs'}
        </div>


    </div>
  )
}
