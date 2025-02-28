import React, {useState} from 'react'
import { motion } from "framer-motion";
import CD from './CD';

export default function TopTracksCard({ user }) {

  const [activeTab, setActiveTab] = useState('short')

  const tabs = [
    { label: "Recently", value: "short", color: "bg-red-400", title: 'Recent Top Songs'},
    { label: "6 Months", value: "medium", color: "bg-red-400", title: 'Top Songs Past 6 Months'},
    { label: "Past Year", value: "long", color: "bg-red-400", title: 'Top Songs Past Year'},
  ];

  const getArtists = () => {
    if (activeTab === "medium") return user?.medium_term_tracks?.items || [];
    if (activeTab === "short") return user?.short_term_tracks?.items || [];
    if (activeTab === "long") return user?.long_term_tracks?.items || [];
    return [];
  };

  const getImageUrl = (item) => {
    if (item.album) {
      // This is a track
      return item.album?.images?.[2]?.url || "/api/placeholder/40/40";
    }
    // This is an artist
    return item.images?.[2]?.url || "/api/placeholder/40/40";
  };

  return (
    <div
        className={`${activeTab === "medium" ? "bg-red-400" : "bg-red-400"} relative min-w-96`}
    >
        <div className="absolute -top-6 left-0 flex">
        {tabs.map((tab) => (
          <motion.button
            key={tab.value}
            className={`w-28 h-8 ${tab.color} rounded-t-lg flex items-center justify-center text-sm 
              ${activeTab === tab.value ? "opacity-100" : "opacity-85 hover:opacity-90"} transition-opacity font-bold`}
            onClick={() => setActiveTab(tab.value)}
            whileHover={{ y: -4 }} // Move tab up when hovered
            animate={{ y: activeTab === tab.value ? -4 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }} // Smooth motion
          >
            {tab.label}
          </motion.button>
        ))}
        </div>
        <div className={`p-6 max-w-sm min-w-fit`}>
              <div className="font-sans text-lg font-bold my-2">
              {tabs.find((t) => t.value === activeTab)?.title}
              </div>
            <div>
            {getArtists().map((item, index) => (
              <CD track={item.name} albumImage={getImageUrl(item)}></CD>
            ))}
            
            </div>
            </div>
    </div>

  )
}
