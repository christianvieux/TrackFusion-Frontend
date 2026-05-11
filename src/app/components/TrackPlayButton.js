import { Button } from '@heroui/react'

import { useTrackManager } from '../context/TrackManagerContext'

import PauseIcon from './Icons/PauseIcon'
import PlayIcon from './Icons/PlayIcon'

export default function TrackPlayButton({
    track,
    playlist = [],
    className = '',
}) {
    const {
        currentTrack,
        isTrackReadyInPlayer,
        isPlaying: playerIsPlaying,
        startPlaylist,
        resumeTrack,
        skipToTrack,
        pauseTrack,
        queue,
        playlist: managerPlaylist,
    } = useTrackManager()

    const isCurrentTrack = currentTrack?.id === track.id
    const isLoading = isCurrentTrack && !isTrackReadyInPlayer
    const isPlaying = isCurrentTrack && playerIsPlaying

    const isInQueue = queue.some((item) => item.uniqueId === track.uniqueId)
    const isInPlaylist = managerPlaylist.some(
        (item) => item.uniqueId === track.uniqueId
    )

    const isManagedTrack = isInQueue || isInPlaylist
    const showPauseButton = !isManagedTrack && isPlaying

    function handlePress() {
        if (isManagedTrack) {
            skipToTrack(track.uniqueId)
            return
        }

        if (isCurrentTrack) {
            if (isPlaying) {
                pauseTrack()
                return
            }

            resumeTrack()
            return
        }

        startPlaylist(playlist, track)
    }

    return (
        <Button
            isIconOnly
            variant="light"
            isLoading={isLoading}
            onPress={handlePress}
            className={`bg-black/70 text-foreground ${className}`}
            aria-label={showPauseButton ? 'Pause track' : 'Play track'}
        >
            {showPauseButton ? (
                <PauseIcon className="size-1/2" />
            ) : (
                <PlayIcon className="size-1/2" />
            )}
        </Button>
    )
}