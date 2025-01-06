// context/TrackListContext.js

import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

const TrackListContext = createContext([]);

export const TrackListProvider = ({ children, initialTrackList = [] }) => {
    const [trackList, setTrackList] = useState(initialTrackList);
    const value = useMemo(() => ({ trackList, setTrackList }), [trackList]);

    // useEffect(() => {
    //     setTrackList(initialTrackList);
    // }, [initialTrackList]);

    return (
        <TrackListContext.Provider value={value}>
            {children}
        </TrackListContext.Provider>
    );
};

TrackListProvider.propTypes = {
    children: PropTypes.node.isRequired,
    initialTrackList: PropTypes.array
};

export const useTrackList = () => useContext(TrackListContext);