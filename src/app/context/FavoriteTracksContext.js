// src/context/FavoriteTracksContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchFavoriteTracks } from '../services/user';
import { useSession } from '../context/SessionContext';

const FavoriteTracksContext = createContext({
    favoriteTracks: [],
    setFavoriteTracks: () => {},
});

export const FavoriteTracksProvider = ({ children }) => {
  const { user } = useSession();
  const [favoriteTracks, setFavoriteTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const refresh = () => {
    if (user) {
      const fetchFavoriteTracksData = async () => {
        setLoading(true);
        try {
          const tracks = await fetchFavoriteTracks(user.id);
          setFavoriteTracks(tracks);
        } catch (error) {
          console.error("Error fetching favorite tracks:", error);
        }
        setLoading(false);
      };
      fetchFavoriteTracksData();
    } else {
      setFavoriteTracks([]);
    }
  };

  useEffect(() => {
    refresh();
  }, [user]);


  return (
    <FavoriteTracksContext.Provider value={{ favoriteTracks, setFavoriteTracks, refresh, loading }}>
      {children}
    </FavoriteTracksContext.Provider>
  );
};

export const useFavoriteTracks = () => useContext(FavoriteTracksContext);