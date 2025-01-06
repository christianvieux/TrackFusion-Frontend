// src/context/FavoriteTracksContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';

const TrackContext = createContext({});

export const TrackProvider = ({ children, track }) => {
  return (
    <TrackContext.Provider value={track}>
      {children}
    </TrackContext.Provider>
  );
};

export const getTrack = () => useContext(TrackContext);