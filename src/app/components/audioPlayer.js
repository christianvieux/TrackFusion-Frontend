// app/components/audioPlayer.js
"use client";
// import "../../../public/css/play_button.css";
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import AudioMotionAnalyzer from "audiomotion-analyzer";
import { color } from "framer-motion";
import {
  Slider,
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import Favorite_Button from "./favoriteButton";
import TrackListQueue from "./TrackListQueue/TrackListQueue";
import { useTrackManager } from "../context/TrackManagerContext";
import { fetchAuthorizedUrl } from "../services/trackService";
import VolumeSlider from "./Volume";
import allowedPlaybackPaths from "../../config/playbackPaths";
import { usePlayback } from "../context/PlaybackContext";
import { formatDuration } from "../utils/audio";
// Icons
import PlayIcon from "./Icons/PlayIcon";
import PauseIcon from "./Icons/PauseIcon";
import ForwardIcon from "./Icons/ForwardIcon";
import BackwardIcon from "./Icons/BackwardIcon";
import RepeatIcon from "./Icons/RepeatIcon";
import QueueIcon from "./Icons/QueueIcon";
import ShuffleIcon from "./Icons/ShuffleIcon";

const custom_options = {
  mode: 10,
  colorMode: "gradient",
  gradient: "rainbow",
  gradientLeft: "rainbow",
  gradientRight: "rainbow",
  channelLayout: "dual-horizontal",
  minFreq: 30,
  maxFreq: 20000,
  fillAlpha: 0,
  mirror: -1,
  reflexFit: true,
  reflexRatio: 0.5,
  reflexAlpha: 1,
  showPeaks: false,
  showBgColor: true,
  overlay: true,
  fadePeaks: false,
  barSpace: 0.5,
  lineWidth: 1.5,
  bgAlpha: 0,
  showScaleX: false,
};

const CustomSvg = ({
  className = "",
  viewBox = "0 0 24 24",
  fill = "none",
  stroke = "currentColor",
  pathData,
  pathProps = {},
  highlight = false,
}) => (
  <svg
    className={`${className}`}
    viewBox={viewBox}
    fill={fill}
    strokeWidth={highlight ? 2 : 1}
    stroke={stroke}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={pathData} {...pathProps} />
  </svg>
);

const AudioControlFormat = ({
  className = "",
  isActive = false,
  Component,
  color = "foreground",
  ...props
}) => {
  return (
      <Component
        className={`size-full transition-all duration-200 ${
          isActive && "scale-110"
        } ${isActive ? `text-green-500` : `text-${color}`} relative z-10 ${className}`}
        strokeWidth={isActive ? "2" : "1.5"}
        {...props}
      />
  );
};

const CustomButton = ({
  isIconOnly = true,
  ariaLabel,
  onClick,
  className,
  children,
  onPress,
  isAudioPlayerDisabled,
  ...rest
}) => (
  <Button
    isIconOnly={isIconOnly}
    size="sm"
    aria-label={ariaLabel}
    onClick={onClick || onPress}
    className={`flex-1 items-center justify-center bg-transparent ${className}`}
    isDisabled={isAudioPlayerDisabled}
    {...rest} // Spread any additional props here
  >
    {children}
  </Button>
);

export default function AudioPlayer({ setShowQueue, showQueue, className }) {
  const {
    shufflePlaylist,
    resetPlaylist,
    playNextTrack,
    playPreviousTrack,
    initializePlaylist,
    playlist,
    setPlaylist,
    currentTrackIndex: trackIndex,
    setCurrentTrackIndex: setTrackIndex,
    queue,
    setQueue,
    currentTrack,
    isPlaying,
    setIsPlaying,
    audioRef,
    resumeTrack: resumeTrackInManager,
    pauseTrack: pauseTrackInManager,
    isTrackReadyInPlayer,
    setIsTrackReadyInPlayer,
  } = useTrackManager();
  const { canShowPlayback } = usePlayback();
  const containerRef = useRef(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [volumeSliderValue, setVolumeSliderValue] = useState(0.8);
  const [audioMotion, setAudioMotion] = useState(null);
  const [currentTrackInPlayer, setCurrentTrackInPlayer] = useState(null);
  const [sliderThumbIsDragging, setSliderThumbIsDragging] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isMetaDataLoaded, setIsMetaDataLoaded] = useState(false);
  const [isFetchingTrack, setIsFetchingTrack] = useState(false);
  const [isTrackReady, setIsTrackReady] = useState(false);
  const isAudioPlayerDisabled =
    (queue.length === 0 && playlist.length === 0 && !currentTrack) ||
    isFetchingTrack;

  const debug_log = false;
  const trackEnded = isMetaDataLoaded && currentTime >= duration;

  const resetPlayback = useCallback(() => {
    setCurrentTrackInPlayer(null);
    setAudioSrc(null);
    setIsMetaDataLoaded(false);
    setIsTrackReady(false);
    setSliderValue(0);
    setCurrentTime(0);
    setDuration(0);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [audioRef]);

  const loadTrackInPlayback = useCallback(
    async (newTrack) => {
      resetPlayback();
      const url = newTrack?.url;

      if (!url) {
        console.warn("No track URL provided");
        return;
      }

      try {
        setCurrentTrackInPlayer(newTrack);
        setIsFetchingTrack(true);
        const authorizedUrl = (await fetchAuthorizedUrl(newTrack.id)).url;
        setAudioSrc(authorizedUrl);
        // console.log("Fetched authorized URL:", authorizedUrl);
      } catch (error) {
        // console.error("Failed to fetch authorized URL:", error);
        setAudioSrc(null);
      } finally {
        setIsFetchingTrack(false);
      }
    },
    [resetPlayback],
  );

  const handlePlay = useCallback(() => {
    resumeTrackInManager();
  }, [resumeTrackInManager]);

  const handlePause = useCallback(() => {
    pauseTrackInManager();
  }, [pauseTrackInManager]);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  }, [handlePlay, handlePause, isPlaying]);

  const handleSkip = useCallback(() => {
    playNextTrack();
    setIsPlaying(true);
    // console.log("Playing next track in playlist", track);
  }, [playNextTrack, setIsPlaying]);

  const handlePrevious = useCallback(() => {
    playPreviousTrack();
    setIsPlaying(true);
    // console.log("Playing previous track in playlist", track);
  }, [playPreviousTrack, setIsPlaying]);

  const handleSliderChange = (value) => {
    setSliderValue(value);
    setSliderThumbIsDragging(true);
  };

  const handleSliderChangeEnd = (value) => {
    const newTime = value * duration;
    audioRef.current.currentTime = newTime;
    setSliderThumbIsDragging(false);
  };

  const onMetadataLoaded = (e) => {
    const audio = e.currentTarget;
    setDuration(audio.duration);
    setIsMetaDataLoaded(true);
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const toggleShuffle = () => {
    const toggle = !isShuffling;
    setIsShuffling(toggle);

    if (toggle) {
      shufflePlaylist(currentTrack);
    } else {
      resetPlaylist(currentTrack);
    }
  };

  const toggleQueue = () => {
    setShowQueue(!showQueue);
  };

  const onTimeUpdate = (e) => {
    setCurrentTime(e.currentTarget.currentTime);
    if (!sliderThumbIsDragging) {
      if (duration > 0) {
        setSliderValue(e.currentTarget.currentTime / duration);
      } else {
        setSliderValue(0);
      }
    }
  };

  const initializeAudioMotion = () => {
    if (!audioMotion) {
      const newAudioMotion = new AudioMotionAnalyzer(containerRef.current, {
        source: audioRef.current,
        ...custom_options,
      });
      setAudioMotion(newAudioMotion);
    }
  };


  // Track gets loaded
  useEffect(() => {
    if (currentTrack && canShowPlayback) {
      loadTrackInPlayback(currentTrack);
    } else {
      resetPlayback();
    }
  }, [currentTrack, loadTrackInPlayback, resetPlayback, canShowPlayback]);

  // Is the track fully loaded and ready to play?
  useEffect(() => {
    const ready = canShowPlayback && isMetaDataLoaded && !isBuffering && !isFetchingTrack && audioSrc !== null;
    setIsTrackReady(ready);
    setIsTrackReadyInPlayer(ready);
  }, [
    isBuffering,
    isFetchingTrack,
    isMetaDataLoaded,
    audioSrc,
    setIsTrackReadyInPlayer,
    canShowPlayback
  ]);

  // If isPlaying and ready to play, then play the track
  // If the track has ended, then skip to the next track
  // If the track is not ready, then pause the track
  // If the track is not playing, then pause the track
  useEffect(() => {
    const onSameTrack = currentTrackInPlayer == currentTrack;
    if (isTrackReady && onSameTrack) {
      if (isPlaying) {
        if (trackEnded && !isLooping) {
          debug_log && console.log("Track ended, skipping to next track.");
          handleSkip();
        } else {
          debug_log && console.log("Audio ready to play and is playing.");
          audioRef.current.play().catch((error) => {
            console.error("Error playing track:", error);
          });
        }
      } else {
        debug_log && console.log("Pausing track.");
        audioRef?.current?.pause();
      }
    } else {
      debug_log && console.log("Track not ready yet.");
      // handlePause();
      // audioRef.current.pause();
    }
  }, [
    isTrackReady,
    isPlaying,
    audioRef,
    audioSrc,
    currentTrack,
    currentTrackInPlayer,
    debug_log,
    handleSkip,
    isBuffering,
    isFetchingTrack,
    isLooping,
    trackEnded,
  ]);

  // Volume Control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volumeSliderValue;
    }
  }, [volumeSliderValue, audioRef]);


  // Hotkeys (F5, F6, F7)
  useEffect(() => {
    // Check if the Media Session API is supported
    if ("mediaSession" in navigator) {
      // Set action handlers for play, pause, next track, and previous track
      navigator.mediaSession.setActionHandler("play", handlePlay);
      navigator.mediaSession.setActionHandler("pause", handlePause);
      navigator.mediaSession.setActionHandler("nexttrack", handleSkip);
      navigator.mediaSession.setActionHandler("previoustrack", handlePrevious);
    }

    // Cleanup function to clear action handlers when the component is unmounted
    return () => {
      if ("mediaSession" in navigator) {
        // Clear each action handler individually by setting them to null
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("nexttrack", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
      }
    };
  }, [
    currentTrack,
    playlist,
    queue,
    handlePlay,
    handlePause,
    handleSkip,
    handlePrevious,
  ]);

  if (!canShowPlayback) {
    return null;
  }

  return (
    <div
      id="PlayBack_Container"
      className={`flex w-full items-end justify-center ${className}`}
    >
      <Card
        id="PlayBack_Card"
        className="flex w-full flex-col items-center justify-center rounded-2xl p-2 text-green sm:max-w-5xl !bg-green-darkest/90"
        isBlurred
        shadow="sm"
      >
        <CardBody className="flex items-center justify-center">
          {/* Playback */}
          <div
            id="Playback"
            className="stretch flex w-full flex-1 flex-col items-center"
          >
            <div ref={containerRef} />

            <audio
              className="w-full"
              src={audioSrc}
              ref={audioRef}
              onLoadedMetadata={onMetadataLoaded}
              onTimeUpdate={onTimeUpdate}
              autoPlay={isPlaying}
              loop={isLooping}
              onEnded={(e) => {
                if (isPlaying) {
                  handleSkip();
                }
              }}
              onWaiting={() => setIsBuffering(true)}
              onCanPlay={() => setIsBuffering(false)}
              // onPlay={handlePlay}
              // onPause={handlePause}
            >
              Your browser does not support the audio element.
            </audio>

            {/* Song Info */}
            <div className="flex w-full flex-wrap items-end justify-between">
              {/* Song Info */}
              <div className="flex max-w-[50%] flex-col sm:max-w-[50%] md:max-w-[60%]">
                {/* Song Title */}
                <p
                  className={`${isAudioPlayerDisabled && "opacity-50"} truncate rounded-3xl text-sm font-bold`}
                >
                  {`${currentTrack?.name || "Unknown"}`}
                </p>
                {/* Song Creator */}
                <p
                  className={`${isAudioPlayerDisabled && "opacity-50"} mb-4 truncate text-xs`}
                >
                  {`Artist: ${currentTrack?.artist || "Unknown"}`}{" "}
                </p>
              </div>
              {/* Volume */}
              <VolumeSlider
                id="right"
                className="min-w-[130px] flex-shrink-0 basis-1/4"
                step={0.01}
                maxValue={1}
                minValue={0}
                defaultValue={volumeSliderValue}
                onChange={(newValue) => setVolumeSliderValue(newValue)}
                isDisabled={isAudioPlayerDisabled}
              />
            </div>
            {/* Slider */}
            <div className="w-full">
              {/* Durations */}
              <div className="flex w-full flex-wrap justify-between">
                {/* Current time of the slider/sound */}
                <p className={`${isAudioPlayerDisabled && "opacity-50"}`}>
                  {formatDuration(sliderValue * duration)}
                </p>

                {/* length of the sound */}
                <p className={`${isAudioPlayerDisabled && "opacity-50"}`}>
                  {formatDuration(duration)}
                </p>
              </div>
              <Slider
                aria-label="slider"
                size="sm"
                color="secondary"
                step={0.001}
                value={sliderValue}
                maxValue={1}
                minValue={0}
                onChange={handleSliderChange}
                onChangeEnd={handleSliderChangeEnd}
                classNames={{
                  thumb: "after:bg-black",
                }}
                isDisabled={isAudioPlayerDisabled}
              />
            </div>
            {/* User Interactions Buttons */}
            <div className="flex w-max flex-col items-center justify-center">
              <div
                id="middle"
                className="relative flex w-full flex-shrink flex-grow basis-0 items-center justify-center gap-4 py-1"
              >
                {/* Add to Favorite */}
                <Favorite_Button
                  isIconOnly={true}
                  size="sm"
                  className="h-9 w-9 flex-1 bg-transparent"
                  isDisabled={isAudioPlayerDisabled}
                  track={currentTrack}
                />
                {/* Shuffle */}
                <CustomButton
                  onPress={toggleShuffle}
                  ariaLabel="shuffle"
                  isAudioPlayerDisabled={isAudioPlayerDisabled}
                >
                  <AudioControlFormat
                    Component={ShuffleIcon}
                    isActive={isShuffling}
                  />
                </CustomButton>
                {/* Prev */}
                <CustomButton
                  ariaLabel="previous"
                  onPress={handlePrevious}
                  isAudioPlayerDisabled={isAudioPlayerDisabled}
                >
                  <AudioControlFormat
                    Component={BackwardIcon}
                    className="fill-green-darkest"
                  />
                </CustomButton>
                {/* Play/Pause */}
                <CustomButton
                  ariaLabel="play"
                  className="relative overflow-visible rounded-full ring-2 ring-green-darkest"
                  onPress={() => {
                    if (isPlaying) {
                      handlePause();
                    } else {
                      handlePlay();
                    }
                  }}
                  isLoading={isBuffering || isFetchingTrack}
                  isAudioPlayerDisabled={isAudioPlayerDisabled}
                >
                  <div className="absolute z-10 size-full rounded-full bg-green-light/20"></div>
                  {isTrackReady && !isPlaying && (
                    <>
                      <div className="absolute z-0 size-full animate-circle_pulse rounded-full bg-green-light/20 ease-in"></div>
                    </>
                  )}
                  {isPlaying ? (
                    <AudioControlFormat
                      id="pause_button"
                      Component={PauseIcon}
                      className="z-20 size-[60%]"
                    />
                  ) : (
                    <AudioControlFormat
                      id="play_button"
                      Component={PlayIcon}
                      className="z-20 size-[50%]"
                    />
                  )}
                </CustomButton>
                {/* Next */}
                <CustomButton
                  ariaLabel="next"
                  onPress={handleSkip}
                  isAudioPlayerDisabled={isAudioPlayerDisabled}
                >
                  <AudioControlFormat
                    Component={ForwardIcon}
                    className="fill-green-darkest"
                  />
                </CustomButton>
                {/* Loop */}
                <CustomButton
                  onPress={toggleLoop}
                  ariaLabel="loop"
                  isAudioPlayerDisabled={isAudioPlayerDisabled}
                >
                  <AudioControlFormat
                    Component={RepeatIcon}
                    isActive={isLooping}
                  />
                </CustomButton>
                {/* View Queue */}
                <CustomButton
                  onPress={toggleQueue}
                  ariaLabel="queue"
                  isAudioPlayerDisabled={isAudioPlayerDisabled}
                >
                  <AudioControlFormat
                    className="h-8 max-h-14 min-w-16 max-w-14"
                    Component={QueueIcon}
                    isActive={showQueue}
                  />
                </CustomButton>
              </div>
              <div className="flex h-1 w-full gap-4">
                <div className="flex flex-1 justify-center items-cente">
                  <div id="circle" className={`rounded-full h-full bg-green-light aspect-square ${(false) ? "opacity-100" : "opacity-0"}`}></div>
                </div>
                <div className="flex flex-1 justify-center items-center">
                  <div id="circle" className={`rounded-full h-full bg-green-light aspect-square ${(isShuffling) ? "opacity-100" : "opacity-0"}`}></div>
                </div>
                <div className="flex flex-1 justify-center items-center">
                  <div id="circle" className={`rounded-full h-full bg-green-light aspect-square ${(false) ? "opacity-100" : "opacity-0"}`}></div>
                </div>
                <div className="flex flex-1 justify-center items-center">
                  <div id="circle" className={`rounded-full h-full bg-green-light aspect-square ${(false) ? "opacity-100" : "opacity-0"}`}></div>
                </div>
                <div className="flex flex-1 justify-center items-center">
                  <div id="circle" className={`rounded-full h-full bg-green-light aspect-square ${(false) ? "opacity-100" : "opacity-0"}`}></div>
                </div>
                <div className="flex flex-1 justify-center items-center">
                  <div id="circle" className={`rounded-full h-full bg-green-light aspect-square ${(isLooping) ? "opacity-100" : "opacity-0"}`}></div>
                </div>
                <div className="flex flex-1 justify-center items-center">
                  <div id="circle" className={`rounded-full h-full bg-green-light aspect-square ${(showQueue) ? "opacity-100" : "opacity-0"}`}></div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
