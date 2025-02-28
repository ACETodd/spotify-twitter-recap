import React, {useState} from 'react'
import { motion } from "framer-motion";

export default function CD({ albumImage, track }) {
    const [isHovering, setIsHovering] = useState(false);
  
    // Define different variants for hovering and not hovering
    const variants = {
      hover: {
        scale: 1.05,
        rotate: 360,
        boxShadow: "0 0 20px -4px rgba(0,0,0,0.5)",
        transition: {
          scale: { duration: 0.3 },
          rotate: { duration: 20, ease: "linear" }
        }
      },
      initial: {
        scale: 1,
        rotate: 0,
        boxShadow: "0 0 16px -4px rgba(0,0,0,0.3)",
        transition: {
          scale: { duration: 0.3 },
          rotate: { duration: 0.5, ease: "easeOut" }
        }
      }
    };

  return (
    <motion.div 
      className="size-[100px] absolute left-1/2 z-10 flex origin-center select-none items-center justify-center overflow-hidden border border-[#d3d3d3] bg-gray-200 shadow-[0_0_16px_-4px_rgba(0,0,0,0.3)] text-white"
      style={{ borderRadius: "50px" }}
      initial={{ x: "-50%" }}
      animate={isHovering ? "hover" : "initial"}
      variants={variants}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <img
          src={albumImage}
          alt={track?.album?.name || 'Album Cover'}
          className="pointer-events-none select-none w-full h-full object-cover"
        />
      </div>
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className="size-[96px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.1px] border-white bg-transparent opacity-35"></div>
        <div className="size-[30px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.5px] border-white backdrop-blur-sm"></div>
        <div className="size-[28px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dotted border-gray-200/15"></div>
        <div className="size-[25px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.5px] border-white bg-[#c3c3c5] opacity-70"></div>
        <div className="size-[17px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#bdbabc]"></div>
        <div className="size-[14px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#cfcdcf]"></div>
        <div className="size-[13px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e9e4ea]"></div>
        <div className="size-[12px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.5px] border-[#c8c7c5] bg-[#f5f5f5] shadow-[0_0_5px_-2px_rgba(0,0,0,0.30)_inset]"></div>
      </div>
    </motion.div>
  )
}