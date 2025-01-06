// src/app/components/PlayPause_Button.js

import React from "react";
import { Button } from "@nextui-org/react";
import { useTrackManager } from "../context/TrackManagerContext"
import PlayIcon from "./Icons/PlayIcon";
import PauseIcon from "./Icons/PauseIcon";


export default function PlayButton({ track, className="", ...args }) {
    const {
        initializePlaylist,

        isPlaying,

        resumeTrack,
        pauseTrack,
    
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
    
        addTrackToQueue,
        removeTrackFromQueue,
        
        startPlaylist,
    } = useTrackManager();
    
    const isOnCurrentTrack = currentTrack?.id === track?.id;
    const handleClick = () => {
        if (isOnCurrentTrack) {
          if (isPlaying) {
            pauseTrack();
          } else {
            resumeTrack();
          }
        } else {
            startPlaylist([track]);
        }
    };
    
    return (
        <Button
        isIconOnly
        variant="light"
        className={`rounded-full ${className}`}
        onClick={handleClick}
        {...args}
        >
        {isOnCurrentTrack && isPlaying ? <PauseIcon /> : <PlayIcon />}
        </Button>
    );
}