// src/contexts/PlaybackContext.js
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const PlaybackContext = createContext();

const allowedPlaybackPaths = [
  '/feed',
  '/track',
  '/playlist',
  '/profile',
  // '/search',
  '/myTracks',
  '/myFavoriteTracks',
  // Add other allowed paths
];

export function PlaybackProvider({ children }) {
  const pathname = usePathname();
  const [canShowPlayback, setCanShowPlayback] = useState(false);

  const checkPathValidity = () => {
    return allowedPlaybackPaths.some(basePath => {
      if (pathname === basePath) {
        return true;
      }

      if (pathname.startsWith(basePath)) {
        const remainingPath = pathname.slice(basePath.length);
        if (remainingPath && remainingPath !== '/') {
          return true;
        }
      }

      return false;
    });
  };

  const values = {
    canShowPlayback,
    allowedPlaybackPaths
  };

  useEffect(() => {
    setCanShowPlayback(checkPathValidity());
  }, [pathname]);

  
  return (
    <PlaybackContext.Provider value={values}>
      {children}
    </PlaybackContext.Provider>
  );
}

// Custom hook to use playback context
export function usePlayback() {
  const context = useContext(PlaybackContext);
  if (context === undefined) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
}