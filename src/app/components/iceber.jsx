import React, { useEffect } from 'react';
import { useRive } from '@rive-app/react-canvas';

export default function Iceberg({ user }) {
  const { rive, RiveComponent } = useRive({
    src: 'iceberg.riv',
    animations: ['iceberg-load', 'stars'],
    autoplay: false,
  });

  useEffect(() => {
    if (rive) {
      console.log('rive contents:', rive.contents);
      
      // Play the first animation
      rive.play('iceberg-load');
      
      // Set up a listener for when the first animation completes
      rive.on('play', (event) => {
        if (event.animationName === 'iceberg-load' && event.type === 'stop') {
          // When iceberg-load finishes, start the stars animation and loop it
          rive.play('stars', { loop: true });
        }
      });

      // Get artists from user data
      const artists = user?.medium_term_artists_long?.items || [];
      
      // Update text runs based on popularity tiers
      populateArtistsByPopularity(rive, artists);
    }
  }, [rive, user]);

  // Function to populate artists based on popularity tiers
  const populateArtistsByPopularity = (riveInstance, artistsList) => {
    try {
      // Initialize counters for each popularity tier
      const tierCounts = {
        tier1: 0, // 81-100 (max 3)
        tier2: 0, // 61-80 (max 4)
        tier3: 0, // 41-60 (max 4)
        tier4: 0, // 21-40 (max 3)
        tier5: 0, // 0-20 (max 3)
      };
      
      // Initialize mapping for which artist run values correspond to which tiers
      const tierToArtistMapping = {
        tier1: { start: 1, end: 3 },  // Artist1-3
        tier2: { start: 4, end: 7 },  // Artist4-7
        tier3: { start: 8, end: 11 }, // Artist8-11
        tier4: { start: 12, end: 14 }, // Artist12-14
        tier5: { start: 15, end: 17 }, // Artist15-17
      };
      
      // Max number of artists per tier
      const tierMaxCounts = {
        tier1: 3, // 81-100
        tier2: 4, // 61-80
        tier3: 4, // 41-60
        tier4: 3, // 21-40
        tier5: 3, // 0-20
      };
      
      // Helper function to determine tier based on popularity
      const getTierForPopularity = (popularity) => {
        if (popularity >= 81 && popularity <= 100) return 'tier1';
        if (popularity >= 61 && popularity <= 80) return 'tier2';
        if (popularity >= 41 && popularity <= 60) return 'tier3';
        if (popularity >= 21 && popularity <= 40) return 'tier4';
        return 'tier5'; // 0-20
      };
      
      // Clear all text runs first
      for (let i = 1; i <= 17; i++) {
        riveInstance.setTextRunValue(`Artist${i}`, "");
      }
      
      // Process each artist and assign to appropriate tier
      artistsList.forEach(artist => {
        const popularity = artist.popularity || 0;
        const tier = getTierForPopularity(popularity);
        const currentCount = tierCounts[tier];
        const maxForTier = tierMaxCounts[tier];
        
        // If we haven't reached the max for this tier
        if (currentCount < maxForTier) {
          // Calculate which Artist# to use
          const artistIndex = tierToArtistMapping[tier].start + currentCount;
          const artistName = artist.name || "";
          
          console.log(`Setting Artist${artistIndex} (${tier}) to: ${artistName} (popularity: ${popularity})`);
          riveInstance.setTextRunValue(`Artist${artistIndex}`, artistName);
          
          // Increment the count for this tier
          tierCounts[tier]++;
        }
      });
      
      console.log("Final tier counts:", tierCounts);
    } catch (error) {
      console.error("Error updating artist text runs:", error);
    }
  };

  return (
    <div className='w-[1550px] h-[750px] bg-black'>
      <RiveComponent style={{width: '100%', height: '100%'}}/>
    </div>
  );
}