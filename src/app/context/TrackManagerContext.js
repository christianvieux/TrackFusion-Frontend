// TrackManagerContext.js
import next from "next";
import React, { useEffect, useRef, createContext, useState, useContext } from "react";
import { useDeletedTracks } from "./deletedTracksContext";
// Create the context
const TrackManagerContext = createContext();

// Create a provider component
export const TrackManagerProvider = ({ children }) => {
  const { deletedTracks } = useDeletedTracks();
  const [initialPlaylist, setInitialPlaylist] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [queue, setQueue] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTrackReadyInPlayer, setIsTrackReadyInPlayer] = useState(false);
  const audioRef = React.useRef(null);

  // Function to reset/initialize the manager
  const resetManager = () => {
    setInitialPlaylist([]);
    setPlaylist([]);
    setQueue([]);
    setCurrentTrackIndex(0);
    setCurrentTrack(null);
    setIsShuffled(false);
    setIsPlaying(false);
    setIsTrackReadyInPlayer(false);
  };

  const generateUniqueId = () => {
    const existingIds = new Set([
      ...playlist.map(item => item.uniqueId),
      ...queue.map(item => item.uniqueId),
    ]);

    let newId;
    do {
      newId = Math.floor(Math.random() * 1000000); // Generates a number between 0 and 999999
    } while (existingIds.has(newId));

    return newId;
  };

  const assignUniqueIdsTo = (array) => {
    return array.map((item) => {
      const newItemWithId = { ...item, uniqueId: generateUniqueId() };
      return newItemWithId;
    });
  }

  const initializePlaylist = (tracks) => {
    const newPlaylistWithIds = assignUniqueIdsTo(tracks);
    setInitialPlaylist(newPlaylistWithIds);

    return newPlaylistWithIds;
  };

  const playNextTrack = () => {
    const nextTrackInQueue = queue[0];

    console.log("Playing next track", playlist)
    if (nextTrackInQueue) {
      removeTrackFromQueue(nextTrackInQueue.uniqueId);
      setCurrentTrack(nextTrackInQueue);
      
      return nextTrackInQueue;
    } else {
      let nextTrack;
      const nextTrackIndex = currentTrackIndex + 1;
      
      if (nextTrackIndex < playlist.length) {
        nextTrack = playlist[nextTrackIndex];
      } else {
        nextTrack = playlist[0];
      }

      const newIndex = playlist.findIndex((t) => t.uniqueId === nextTrack.uniqueId);
      setCurrentTrackIndex(newIndex);
      setCurrentTrack(nextTrack);
      setIsPlaying(true);        

      return playlist[newIndex];
    }
  };

  const playPreviousTrack = () => {
    const threshold = 2; // If the track is more than 2 seconds in, restart the track
    const currentPosition = audioRef.current.currentTime;
    
    if (currentPosition > threshold) {
      // Restart the track
      audioRef.current.currentTime = 0;
      // console.log("Restarting track");

      return currentTrack;
    } else {
      // Play the previous track
      const newCurrentTrackIndex = currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1;
      const newCurrentTrack = playlist[newCurrentTrackIndex];
      
      setCurrentTrackIndex(newCurrentTrackIndex);
      setCurrentTrack(newCurrentTrack);

      // console.log("Playing previous track");

      setIsPlaying(true);
      return newCurrentTrack;
    }
  };  

  const shuffleArray = (array, startingItem) => {
    const newArray = [...array];

    if (startingItem) {
      const startingIndex = newArray.findIndex((t) => t == startingItem);
      newArray.splice(startingIndex, 1);
    }

    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    if (startingItem) {
      newArray.unshift(startingItem);
    }

    return newArray;
  };

  const shufflePlaylist = () => {
    const newPlaylist = [...playlist];
    const currentTrackIndex = newPlaylist.findIndex(
      (t) => t.uniqueId === currentTrack.uniqueId
    );
    // Remove the current track from the playlist
    newPlaylist.splice(currentTrackIndex, 1);

    // Shuffle the remaining tracks
    for (let i = newPlaylist.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPlaylist[i], newPlaylist[j]] = [newPlaylist[j], newPlaylist[i]];
    }

    // Add the current track to the beginning of the shuffled playlist
    newPlaylist.unshift(currentTrack);

    setPlaylist(newPlaylist);
    setCurrentTrackIndex(0);
    setCurrentTrack(newPlaylist[0]);
  };

  const resetPlaylist = () => {
    const newCurrentTrackIndex = initialPlaylist.findIndex((t) => t.uniqueId === currentTrack.uniqueId)
    setPlaylist(initialPlaylist);
    setCurrentTrackIndex(newCurrentTrackIndex);
  };

  const isTrackInPlaylist = (track) => {
    return playlist.some((t) => t.uniqueId === track.uniqueId);
  };

  const resumeTrack = () => {
    setIsPlaying(true);
  }
  
  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const startPlaylist = (playlist, startingTrack, canPlay=true) => {
    const newInitialPlaylistWithIds = initializePlaylist(playlist);
    let newPlaylist = newInitialPlaylistWithIds;
    let startingTrackWithId = null;

    if (startingTrack) {
      startingTrackWithId = newInitialPlaylistWithIds.find((t) => t.id === startingTrack.id);
      if (isShuffled) {
        newPlaylist = shuffleArray(newPlaylist, startingTrackWithId);
      }
    } else if (isShuffled) {
      newPlaylist = shuffleArray(newPlaylist);
    }

    const newCurrentTrackIndex = startingTrackWithId
    ? newPlaylist.findIndex((t) => t.uniqueId === startingTrackWithId.uniqueId)
    : 0; // Default to the first track if startingTrack is not provided

    // initializePlaylist(playlist);
    setPlaylist(newPlaylist);
    setCurrentTrackIndex(newCurrentTrackIndex);
    setCurrentTrack(newPlaylist[newCurrentTrackIndex]);
    if (canPlay) {
      resumeTrack()
    };
  };
  
  const skipToTrack = (uniqueId) => {
    // Check if the track is in the queue
    const trackInQueueIndex = queue.findIndex((t) => t.uniqueId === uniqueId);
    if (trackInQueueIndex !== -1) {
      // Remove all tracks up to and including the target track in the queue
      const newTrack = queue[trackInQueueIndex];
      const newQueue = queue.slice(trackInQueueIndex + 1);
      setQueue(newQueue);
      setCurrentTrack(newTrack);
      resumeTrack();
      return newTrack;
    }

    // Check if the track is in the playlist
    const trackInPlaylistIndex = playlist.findIndex((t) => t.uniqueId === uniqueId);
    if (trackInPlaylistIndex !== -1) {
      setCurrentTrackIndex(trackInPlaylistIndex);
      setCurrentTrack(playlist[trackInPlaylistIndex]);
      resumeTrack();
      return playlist[trackInPlaylistIndex];
    }

    // If the track is not found in either the queue or the playlist
    console.error(`Track with uniqueId ${uniqueId} not found in queue or playlist`);
    return null;
  };

  // Helper function to add a track
  const addTrack = (track, setCollection) => {
    const newTrackWithUniqueId = { ...track, uniqueId: generateUniqueId() };
    setCollection((prev) => [...prev, newTrackWithUniqueId]);

    return newTrackWithUniqueId;
  };

  // Helper function to remove a track
  const removeTrack = (uniqueId, setCollection) => {
    setCollection((prev) => {
      return prev.filter((track) => track.uniqueId !== uniqueId)
    });
  };

  // Helper function to remove a track using the track's id
  const removeTrackById = (trackId, setCollection) => {
    setCollection((prev) => {
      return prev.filter((track) => track.id !== trackId)
    });
  };

  // Function to add a track to the playlist
  const addTrackToPlaylist = (track) => {
    return addTrack(track, setPlaylist);
  };  

  // Function to remove a track from the playlist
  const removeTrackFromPlaylist = (uniqueId) => {
    removeTrack(uniqueId, setPlaylist);
  };

  // Function to remove a track from the manager and stop playing it
  const removeTrackFromManager = (trackId) => {
    removeTrackById(trackId, setPlaylist);
    removeTrackById(trackId, setQueue);

    // Stop playing the track if it's the current track
    if (currentTrack && currentTrack.id === trackId) {
      setCurrentTrack(null);
      setIsPlaying(false);
    }
  };

  // Function to add a track to the queue
  const addTrackToQueue = (track) => {
    addTrack(track, setQueue);
  };

  // Function to remove a track from the queue
  const removeTrackFromQueue = (uniqueId) => {
    removeTrack(uniqueId, setQueue);
  };

  // Context value
  const contextValue = {
    audioRef,

    skipToTrack,
    resumeTrack,
    pauseTrack,

    isPlaying,
    setIsPlaying,
    
    startPlaylist,
    shufflePlaylist,
    resetPlaylist,
    
    playNextTrack,
    playPreviousTrack,

    initializePlaylist,
    initialPlaylist,

    playlist,
    setPlaylist,

    queue,
    setQueue,

    currentTrackIndex,
    setCurrentTrackIndex,

    currentTrack,
    setCurrentTrack,

    addTrackToPlaylist,
    removeTrackFromPlaylist,
    removeTrackFromManager,

    addTrackToQueue,
    removeTrackFromQueue,

    isTrackReadyInPlayer, 
    setIsTrackReadyInPlayer,
  };

  // start the playlis when item gets added to queue with no current track or playlist
  useEffect(() => {
    if (queue.length > 0 && !currentTrack && playlist.length === 0) {
      playNextTrack();
    }
  }, [
    queue,
  ]);

  // Remove track from manager when it's deleted
  useEffect(() => {
    deletedTracks.forEach((trackId) => {
      removeTrackFromManager(trackId);
    });
  }, [deletedTracks]);

  return (
    <TrackManagerContext.Provider value={contextValue}>
      {children}
    </TrackManagerContext.Provider>
  );
};

// Custom hook for using the context
export const useTrackManager = () => {
  const context = useContext(TrackManagerContext);
  if (context === undefined) {
    throw new Error(
      "useTrackManager must be used within a TrackManagerProvider"
    );
  }
  return context;
};
