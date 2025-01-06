import React, { memo, useState } from "react";
import { Avatar, Button, Image } from "@nextui-org/react";
import { useTrackManager } from "../context/TrackManagerContext";
import Play_Svg from "./Icons/PlayIcon.js";
import Pause_Svg from "./Icons/PauseIcon.js";
import NextImage from "next/image";
import Music_Wave_Svg from "./Icons/MusicWave.js";

const TrackCard = (props) => {
  const {
    track= {},
    playlist= [],
    className,
    show_play_pause_button = false,
    canShowControls = true,
    rightContent,
    onPlay = () => {},
    onPause = () => {},
    // isLoading = false,
    
    classNames = {
      // TrackCard: "",
    },
    ...rest
  } = props;
  const {
    currentTrack,
    isTrackReadyInPlayer,
    isPlaying: _isPlaying,
    startPlaylist,
    resumeTrack,
    skipToTrack,
    pauseTrack,
    queue: managerQueue,
    playlist: managerPlaylist,
  } = useTrackManager();
  const isCurrentlyOnThisTrack = currentTrack?.id === track.id;
  const isLoading = !isTrackReadyInPlayer && isCurrentlyOnThisTrack;
  const isPlaying = isCurrentlyOnThisTrack && _isPlaying;
  const isInQueue = managerQueue.some((t) => t.uniqueId === track.uniqueId);
  const isInPlaylist = managerPlaylist.some((t) => t.uniqueId === track.uniqueId);
  const canShowWave = (!isInQueue && !isInPlaylist) && isPlaying;
  const showPauseButton = canShowControls & !isInQueue && !isInPlaylist && isPlaying;
  const [mouseEntered, setMouseEntered] = useState(false);

  const handlePlay = () => {
    if (isInQueue || isInPlaylist) {
        skipToTrack(track.uniqueId);
    } else {
      if (isCurrentlyOnThisTrack) {
        if (isPlaying) {
          pauseTrack();
        } else {
          resumeTrack();
        }
      } else {
        startPlaylist(playlist, track);
      }
    }
  };

  const handlePause = () => {
    pauseTrack();
    onPause();
  };

  return (
    <div
      id="track-card"
      className={`relative z-0 flex w-full items-center gap-4  ${className ? className : ""}`}
      onMouseEnter={() => {
        setMouseEntered(true);
      }}
      onMouseLeave={() => {
        setMouseEntered(false);
      }}
      {...rest}
    >
      <div id="left_conent" className="flex w-full min-w-0 items-center gap-2">
        {/* Track Artwork */}
        <div
          id="artwork_container"
          className="relative flex size-9 flex-shrink-0 items-center justify-center"
        >
          {/* Play/Pause Button */}
          {canShowControls && (show_play_pause_button || mouseEntered || isLoading) && (
            <Button
              className="z-10 !bg-black/70"
              isIconOnly
              variant="light"
              onPress={(showPauseButton ? handlePause : handlePlay)}
              isLoading={isLoading}
            >
              {showPauseButton ? (
                <Pause_Svg
                  className={`h-[50%] w-[50%] ${classNames.svg || ""}`}
                />
              ) : (
                <Play_Svg
                  className={`h-[50%] w-[50%] ${classNames.svg || ""}`}
                />
              )}

              {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-[50%] text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                  />
                </svg> */}
            </Button>
          )}
          {/* Art */}
          <div
            id="artwork"
            className="absolute z-0 flex size-full items-center justify-center"
          >
            {canShowWave && !isLoading ? (
              <Music_Wave_Svg className="absolute h-[100%] w-[100%]" />
            ) : (
              !isLoading && (
                // <Avatar
                // className="absolute h-full w-full"
                // size="sm"
                // radius="sm"
                // showFallback
                // // src="https://images.unsplash.com/broken"
                // />
                <Image
                  as={NextImage}
                  src={track.image_url || "/images/6068474.jpg"}
                  fallbackSrc="/images/6068474.jpg"
                  alt={track.title || "Track Cover"}
                  width={30}
                  height={30}
                  className="!h-full !w-full rounded-lg"
                  classNames={{
                    wrapper:
                      "h-full w-full !max-h-full !max-w-full flex justify-center items-center",
                  }}
                />
              )
            )}
          </div>
        </div>

        {/* Track info */}
        <div className="flex flex-col truncate">
          {/* name of track*/}
          <p className="truncate text-left text-base font-bold">{track.name}</p>
          {/* name of artist */}
          <p className="truncate text-left text-sm">{track.artist}</p>
        </div>
      </div>
      {/* Right Content */}
      <div id="right_content" className="flex items-center justify-center">
        {rightContent}
      </div>
    </div>
  );
};

TrackCard.displayName = 'TrackCard';
export default memo(TrackCard);
