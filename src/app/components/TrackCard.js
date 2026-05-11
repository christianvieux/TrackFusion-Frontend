import { memo } from 'react'
import Image from 'next/image'

const fallbackArtwork = '/images/6068474.jpg'

function TrackCard({
    track = {},
    className = '',
    rightContent,
    ...props
}) {
    return (
        <div
            id="track-card"
            className={`relative z-0 flex w-max items-center gap-4 ${className}`}
            {...props}
        >
            <div
                id="left_content"
                className="flex min-w-0 flex-1 items-center gap-2"
            >
                <div className="relative flex size-9 shrink-0 items-center justify-center">
                    <div className="absolute z-0 flex size-full items-center justify-center overflow-hidden rounded-lg">
                        <Image
                            src={track.image_url || fallbackArtwork}
                            alt={track.title || track.name || 'Track cover'}
                            width={36}
                            height={36}
                            className="size-full rounded-lg object-cover"
                            onError={(event) => {
                                event.currentTarget.src = fallbackArtwork
                            }}
                        />
                    </div>
                </div>

                <div className="max-w-full min-w-0 flex-1 overflow-hidden">
                    <p className="w-max max-w-full truncate text-left text-base font-bold text-foreground">
                        {track.name || 'Unknown Track'}
                    </p>

                    <p className="truncate text-left text-sm text-muted-foreground">
                        {track.artist || 'Unknown Artist'}
                    </p>
                </div>
            </div>

            {rightContent && (
                <div
                    id="right_content"
                    className="flex items-center justify-center"
                >
                    {rightContent}
                </div>
            )}
        </div>
    )
}

TrackCard.displayName = 'TrackCard'

export default memo(TrackCard)