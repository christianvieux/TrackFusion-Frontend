// src/app/context/deletedTracksContext.js

import React, { createContext, useContext, useEffect, useState } from "react";

const DeletedTracksContext = createContext([]);

export const DeletedTracksProvider = ({ children }) => {
  const [deletedTracks, setDeletedTracks] = useState([]);
  const addDeletedTrack = (trackId) => {
    setDeletedTracks((prev) => [...prev, trackId]);
  };

  return (
    <DeletedTracksContext.Provider value={{ deletedTracks, setDeletedTracks, addDeletedTrack }}>
      {children}
    </DeletedTracksContext.Provider>
  );
};

export const useDeletedTracks = () => {
  return useContext(DeletedTracksContext);
};
