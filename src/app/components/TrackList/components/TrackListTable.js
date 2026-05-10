'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Table } from '@heroui/react'
import Fuse from 'fuse.js'

import Pagination from '../../pagination/component'

import { useTrackEvents } from '../../../context/TrackEventsContext'
import { useDebounce } from '../../../hooks/useDebounce'

import {
    DESKTOP_COLUMNS,
    FUSE_OPTIONS,
    MOBILE_COLUMNS,
    ROWS_PER_PAGE,
    initialFilters,
} from '../constants'

import { getTrackKey, trackMatchesFilters } from '../utils'

import EmptyTrackRow from './EmptyTrackRow'
import TrackFilters from './TrackFilters'
import TrackTableHeader from './TrackTableHeader'
import TrackRowDesktop from './TrackRowDesktop'
import TrackRowMobile from './TrackRowMobile'

function getSearchedTracks(tracks, debouncedSearch, fuse) {
    if (!debouncedSearch) return tracks

    return fuse.search(debouncedSearch).map((result) => result.item)
}

function getFilteredTracks(tracks, filters) {
    return tracks.filter((track) =>
        trackMatchesFilters(track, filters.includes, filters.excludes)
    )
}

function getTotalPages(trackCount) {
    return Math.max(1, Math.ceil(trackCount / ROWS_PER_PAGE))
}

function getPaginatedTracks(tracks, page) {
    const start = (page - 1) * ROWS_PER_PAGE
    return tracks.slice(start, start + ROWS_PER_PAGE)
}

export default function TrackListTable({
    trackList: tracks = [],
    setTrackList = () => {},
    className = '',
}) {
    const { lastUpdatedTrack, lastDeletedTrackId } = useTrackEvents()

    const [filters, setFilters] = useState(initialFilters)
    const [page, setPage] = useState(1)

    const debouncedSearch = useDebounce(filters.searchTerm, 300)

    const fuse = useMemo(() => {
        return new Fuse(tracks, FUSE_OPTIONS)
    }, [tracks])

    const searchedTracks = useMemo(() => {
        return getSearchedTracks(tracks, debouncedSearch, fuse)
    }, [tracks, debouncedSearch, fuse])

    const filteredTracks = useMemo(() => {
        return getFilteredTracks(searchedTracks, filters)
    }, [searchedTracks, filters])

    const totalPages = useMemo(() => {
        return getTotalPages(filteredTracks.length)
    }, [filteredTracks.length])

    const paginatedTracks = useMemo(() => {
        return getPaginatedTracks(filteredTracks, page)
    }, [filteredTracks, page])

    const updateTrackInList = useCallback(
        (updatedTrack) => {
            if (!updatedTrack?.id) return

            setTrackList((currentTracks = []) =>
                currentTracks.map((track) =>
                    Number(track.id) === Number(updatedTrack.id)
                        ? { ...track, ...updatedTrack }
                        : track
                )
            )
        },
        [setTrackList]
    )

    const removeTrackFromList = useCallback(
        (trackId) => {
            if (!trackId) return

            setTrackList((currentTracks = []) =>
                currentTracks.filter(
                    (track) => Number(track.id) !== Number(trackId)
                )
            )
        },
        [setTrackList]
    )

    useEffect(() => {
        if (!lastUpdatedTrack?.track) return

        updateTrackInList(lastUpdatedTrack.track)
    }, [lastUpdatedTrack, updateTrackInList])

    useEffect(() => {
        if (!lastDeletedTrackId?.trackId) return

        removeTrackFromList(lastDeletedTrackId.trackId)
    }, [lastDeletedTrackId, removeTrackFromList])

    useEffect(() => {
        setPage(1)
    }, [debouncedSearch, filters.includes, filters.excludes, tracks])

    const sharedRowProps = {
        page,
        paginatedTracks,
    }
    return (
        <div
            id="Track_List_Table"
            className={`flex max-h-full min-h-0 flex-col gap-4 rounded-lg p-4 text-foreground ${className}`}
        >
            {/* Uncomment when you want filters/search back */}
            <TrackFilters filters={filters} setFilters={setFilters} />

            <Table
                id="table_container_desktop"
                className="hidden min-h-0 flex-1 overflow-auto rounded-none bg-transparent pr-4 md:block"
            >
                <Table.Content
                    aria-label="Track list"
                    className="bg-transparent"
                >
                    <TrackTableHeader
                        columns={DESKTOP_COLUMNS}
                        className="[&_th]:px-0 [&_th]:pr-4"
                    />

                    <Table.Body className="">
                        {paginatedTracks.length === 0 ? (
                            <EmptyTrackRow colSpan={DESKTOP_COLUMNS.length} />
                        ) : (
                            paginatedTracks.map((track, index) => (
                                <TrackRowDesktop
                                    key={getTrackKey(track, index)}
                                    track={track}
                                    index={index}
                                    className="border-none"
                                    {...sharedRowProps}
                                />
                            ))
                        )}
                    </Table.Body>
                </Table.Content>
            </Table>

            <Table
                id="table_container_mobile"
                className="min-h-0 flex-1 overflow-auto rounded-none bg-transparent pr-4 md:hidden"
            >
                <Table.Content
                    aria-label="Track list"
                    className="w-full bg-transparent"
                >
                    <TrackTableHeader
                        columns={MOBILE_COLUMNS}
                        className="sr-only"
                    />

                    <Table.Body>
                        {paginatedTracks.length === 0 ? (
                            <EmptyTrackRow colSpan={MOBILE_COLUMNS.length} />
                        ) : (
                            paginatedTracks.map((track, index) => (
                                <TrackRowMobile
                                    key={getTrackKey(track, index)}
                                    track={track}
                                    index={index}
                                    {...sharedRowProps}
                                />
                            ))
                        )}
                    </Table.Body>
                </Table.Content>
            </Table>

            <div id="Pagination" className="flex shrink-0 justify-center pt-2">
                <Pagination page={page} total={totalPages} onChange={setPage} />
            </div>
        </div>
    )
}
