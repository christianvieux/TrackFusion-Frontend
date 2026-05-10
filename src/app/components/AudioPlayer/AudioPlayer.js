'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Slider } from '@heroui/react'
import {
    Shuffle,
    SkipBack,
    SkipForward,
    Play,
    Pause,
    Repeat,
    List,
} from 'lucide-react'

import FavoriteButton from '../FavoriteButton'
import VolumeSlider from './Volume'
import AudioElement from './AudioElement'

import { usePlayback } from '../../context/PlaybackContext'
import { useTrackManager } from '../../context/TrackManagerContext'
import { fetchAuthorizedUrl } from '../../services/trackService'
import { formatDuration } from '../../utils/audio'
import TrackOptionsDropdown from '../TrackOptionsDropdown'

/* -------------------- */
/* SUBCOMPONENTS        */
/* -------------------- */

/** A small dot indicator shown beneath a control button when active */
function ActiveDot({ isActive }) {
    return (
        <span
            className={`mx-auto block h-1 w-1 rounded-full transition-opacity ${
                isActive ? 'bg-player-accent opacity-100' : 'opacity-0'
            }`}
        />
    )
}

/** Icon button used for all transport/control actions */
function ControlButton({
    ariaLabel,
    onPress,
    isDisabled,
    className = '',
    children,
}) {
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            onClick={onPress}
            disabled={isDisabled}
            className={`cursor-pointer flex size-8 flex-col items-center justify-center gap-0.5 rounded-full bg-transparent text-player-muted disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        >
            {children}
        </button>
    )
}

/** Wraps an icon with optional active color tint */
function ControlIcon({ Icon, isActive = false, className = '' }) {
    return (
        <Icon
            className={`h-5 w-5 transition-colors ${
                isActive ? 'text-player-accent' : 'text-player-muted'
            } ${className}`}
        />
    )
}

/* -------------------- */
/* AUDIO PLAYER         */
/* -------------------- */

export default function AudioPlayer({
    className = '',
}) {
    const {
        shufflePlaylist,
        resetPlaylist,
        playNextTrack,
        playPreviousTrack,
        playlist,
        queue,
        currentTrack,
        isPlaying,
        setIsPlaying,
        audioRef,
        resumeTrack: resumeTrackInManager,
        pauseTrack: pauseTrackInManager,
        setIsTrackReadyInPlayer,
    } = useTrackManager()

    const { canShowPlayback } = usePlayback()

    const [audioSrc, setAudioSrc] = useState(null)
    const [currentTrackInPlayer, setCurrentTrackInPlayer] = useState(null)

    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [sliderValue, setSliderValue] = useState(0)
    const [volumeValue, setVolumeValue] = useState(0.8)

    const [isSliderDragging, setIsSliderDragging] = useState(false)
    const [isLooping, setIsLooping] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)
    const [isBuffering, setIsBuffering] = useState(false)
    const [isMetadataLoaded, setIsMetadataLoaded] = useState(false)
    const [isFetchingTrack, setIsFetchingTrack] = useState(false)
    const [isTrackReady, setIsTrackReady] = useState(false)

    const isDisabled =
        (queue.length === 0 && playlist.length === 0 && !currentTrack) ||
        isFetchingTrack

    const hasTrackEnded = isMetadataLoaded && currentTime >= duration

    /* -------------------- */
    /* HANDLERS             */
    /* -------------------- */

    const resetPlayback = useCallback(() => {
        setCurrentTrackInPlayer(null)
        setAudioSrc(null)
        setIsMetadataLoaded(false)
        setIsTrackReady(false)
        setSliderValue(0)
        setCurrentTime(0)
        setDuration(0)
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
    }, [audioRef])

    const loadTrack = useCallback(
        async (track) => {
            resetPlayback()
            if (!track?.url) return
            try {
                setCurrentTrackInPlayer(track)
                setIsFetchingTrack(true)
                const { url } = await fetchAuthorizedUrl(track.id)
                setAudioSrc(url)
            } catch (err) {
                console.error('Failed to fetch authorized URL:', err)
                setAudioSrc(null)
            } finally {
                setIsFetchingTrack(false)
            }
        },
        [resetPlayback]
    )

    const handlePlay = useCallback(
        () => resumeTrackInManager(),
        [resumeTrackInManager]
    )
    const handlePause = useCallback(
        () => pauseTrackInManager(),
        [pauseTrackInManager]
    )

    const handlePlayPause = useCallback(() => {
        isPlaying ? handlePause() : handlePlay()
    }, [isPlaying, handlePlay, handlePause])

    const handleSkip = useCallback(() => {
        playNextTrack()
        setIsPlaying(true)
    }, [playNextTrack, setIsPlaying])

    const handlePrevious = useCallback(() => {
        playPreviousTrack()
        setIsPlaying(true)
    }, [playPreviousTrack, setIsPlaying])

    function handleSliderChange(value) {
        setSliderValue(value)
        setIsSliderDragging(true)
    }

    function handleSliderChangeEnd(value) {
        if (!audioRef.current || !duration) return
        audioRef.current.currentTime = value * duration
        setIsSliderDragging(false)
    }

    function handleMetadataLoaded(e) {
        setDuration(e.currentTarget.duration)
        setIsMetadataLoaded(true)
    }

    function handleTimeUpdate(e) {
        const { currentTime: t, duration: d } = e.currentTarget
        setCurrentTime(t)
        if (!isSliderDragging) setSliderValue(d > 0 ? t / d : 0)
    }

    function toggleShuffle() {
        const next = !isShuffling
        setIsShuffling(next)
        next ? shufflePlaylist(currentTrack) : resetPlaylist(currentTrack)
    }

    /* -------------------- */
    /* EFFECTS              */
    /* -------------------- */

    useEffect(() => {
        canShowPlayback && currentTrack
            ? loadTrack(currentTrack)
            : resetPlayback()
    }, [currentTrack, canShowPlayback, loadTrack, resetPlayback])

    useEffect(() => {
        const ready =
            canShowPlayback &&
            isMetadataLoaded &&
            !isBuffering &&
            !isFetchingTrack &&
            !!audioSrc
        setIsTrackReady(ready)
        setIsTrackReadyInPlayer(ready)
    }, [
        audioSrc,
        canShowPlayback,
        isBuffering,
        isFetchingTrack,
        isMetadataLoaded,
        setIsTrackReadyInPlayer,
    ])

    useEffect(() => {
        if (!isTrackReady || currentTrackInPlayer !== currentTrack) return
        if (!isPlaying) {
            audioRef.current?.pause()
            return
        }
        if (hasTrackEnded && !isLooping) {
            handleSkip()
            return
        }
        audioRef.current?.play().catch(console.error)
    }, [
        audioRef,
        currentTrack,
        currentTrackInPlayer,
        handleSkip,
        hasTrackEnded,
        isLooping,
        isPlaying,
        isTrackReady,
    ])

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volumeValue
    }, [audioRef, volumeValue])

    useEffect(() => {
        if (!('mediaSession' in navigator)) return
        const actions = {
            play: handlePlay,
            pause: handlePause,
            nexttrack: handleSkip,
            previoustrack: handlePrevious,
        }
        Object.entries(actions).forEach(([a, h]) =>
            navigator.mediaSession.setActionHandler(a, h)
        )
        return () =>
            Object.keys(actions).forEach((a) =>
                navigator.mediaSession.setActionHandler(a, null)
            )
    }, [handlePlay, handlePause, handleSkip, handlePrevious])

    if (!canShowPlayback) return null

    /* -------------------- */
    /* CONTROLS CONFIG      */
    /* -------------------- */

    const controls = [
        {
            key: 'favorite',
            node: (
                <FavoriteButton
                    isIconOnly
                    className="size-7 bg-transparent text-player-muted"
                    isDisabled={isDisabled}
                    track={currentTrack}
                />
            ),
            isActive: false,
        },
        {
            key: 'shuffle',
            icon: Shuffle,
            ariaLabel: 'shuffle',
            onPress: toggleShuffle,
            isActive: isShuffling,
        },
        {
            key: 'previous',
            icon: SkipBack,
            ariaLabel: 'previous',
            onPress: handlePrevious,
            isActive: false,
        },
        {
            key: 'playpause',
            node: (
                <div className="relative size-8">
                    {isTrackReady && !isPlaying && (
                        <span className="animate-circle_pulse absolute inset-0 rounded-full bg-player-muted/20" />
                    )}

                    <button
                        type="button"
                        aria-label={isPlaying ? 'pause' : 'play'}
                        onClick={handlePlayPause}
                        disabled={isDisabled || isBuffering || isFetchingTrack}
                        className="relative flex size-8 items-center justify-center overflow-visible rounded-full bg-player-muted/25 ring-2 ring-player-muted disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {React.createElement(isPlaying ? Pause : Play, {
                            className: 'z-10 size-4 text-player-foreground',
                            fill: 'currentColor',
                        })}
                    </button>
                </div>
            ),
            isActive: false,
        },
        {
            key: 'next',
            icon: SkipForward,
            ariaLabel: 'next',
            onPress: handleSkip,
            isActive: false,
        },
        {
            key: 'loop',
            icon: Repeat,
            ariaLabel: 'loop',
            onPress: () => setIsLooping((v) => !v),
            isActive: isLooping,
        },
        {
            key: 'queue',
            icon: List,
            ariaLabel: 'queue',
            isActive: false, // TODO: finish implementing toggle 
        },
    ]

    /* -------------------- */
    /* RENDER               */
    /* -------------------- */

    return (
        <div
            className={`flex w-xs items-end sm:w-sm md:w-lg lg:w-xl ${className}`}
        >
            <Card className="w-full rounded-2xl bg-player px-5 py-4 text-player-foreground shadow-card">
                <Card.Content className="w-full">
                    <AudioElement
                        audioRef={audioRef}
                        audioSrc={audioSrc}
                        isPlaying={isPlaying}
                        isLooping={isLooping}
                        onMetadataLoaded={handleMetadataLoaded}
                        onTimeUpdate={handleTimeUpdate}
                        onBufferingStart={() => setIsBuffering(true)}
                        onBufferingEnd={() => setIsBuffering(false)}
                        onEnded={() => {
                            if (isPlaying) handleSkip()
                        }}
                    />

                    {/* Row 1: Track info + Volume + Options*/}
                    <div className="flex w-full items-end justify-between gap-4">
                        <div className="min-w-0">
                            <p
                                className={`truncate text-sm font-bold text-player-muted ${isDisabled ? 'opacity-50' : ''}`}
                            >
                                {currentTrack?.name || 'Unknown'}
                            </p>
                            <p
                                className={`truncate text-xs text-player-muted ${isDisabled ? 'opacity-50' : ''}`}
                            >
                                Artist: {currentTrack?.artist || 'Unknown'}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <VolumeSlider
                                className="shrink-0"
                                defaultValue={volumeValue}
                                onChange={setVolumeValue}
                                isDisabled={isDisabled}
                            />

                            <TrackOptionsDropdown
                                isDisabled={isDisabled}
                                track={currentTrack}
                            />
                        </div>
                    </div>

                    {/* Row 2: Progress slider + timestamps */}
                    <div className="mt-2 w-full space-y-2">
                        <div
                            className={`flex w-full justify-between text-xs text-player-muted ${isDisabled ? 'opacity-50' : ''}`}
                        >
                            <span>
                                {formatDuration(sliderValue * duration)}
                            </span>
                            <span>{formatDuration(duration)}</span>
                        </div>
                        <Slider
                            aria-label="Track progress"
                            value={sliderValue}
                            minValue={0}
                            maxValue={1}
                            step={0.001}
                            onChange={handleSliderChange}
                            onChangeEnd={handleSliderChangeEnd}
                            isDisabled={isDisabled}
                            className="mx-0 flex max-w-full items-center justify-center px-2"
                        >
                            <Slider.Track className="h-1 rounded-full border-0 bg-player-line">
                                <Slider.Fill className="rounded-full bg-player-muted" />
                                <Slider.Thumb className="size-4 border-2 border-player-muted bg-player-accent" />
                            </Slider.Track>
                        </Slider>
                    </div>

                    {/* Row 3: Transport controls */}
                    <div className="mt-2 flex w-full items-center justify-center gap-1">
                        {controls.map(
                            ({
                                key,
                                node,
                                icon: Icon,
                                ariaLabel,
                                onPress,
                                isActive,
                            }) =>
                                node ? (
                                    <div
                                        key={key}
                                        className="flex flex-col items-center gap-0.5"
                                    >
                                        {node}
                                        <ActiveDot isActive={isActive} />
                                    </div>
                                ) : (
                                    <div
                                        key={key}
                                        className="flex flex-col items-center gap-0.5"
                                    >
                                        <ControlButton
                                            ariaLabel={ariaLabel}
                                            onPress={onPress}
                                            isDisabled={isDisabled}
                                        >
                                            <ControlIcon
                                                Icon={Icon}
                                                isActive={isActive}
                                            />
                                        </ControlButton>
                                        <ActiveDot isActive={isActive} />
                                    </div>
                                )
                        )}
                    </div>
                </Card.Content>
            </Card>
        </div>
    )
}
