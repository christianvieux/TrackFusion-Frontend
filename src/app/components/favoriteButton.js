//src/app/components/favoriteButton.js

import React, { useState, useEffect } from "react";
import { Button, Spacer } from "@nextui-org/react";
import { useSession } from "../context/SessionContext";
import { addFavoriteTrack, removeFavoriteTrack } from "../services/user";
import { fetchFavoriteTracks } from "../services/user";
import { useFavoriteTracks } from "../context/FavoriteTracksContext";
import { useTrackList } from "../context/TrackListContext.js";
import PropTypes from "prop-types";
import { withAuthGuard } from "../hoc/withAuthGuard";

function FavoriteButton({
  className,
  classNames = {},
  track: trackObject,
  showLikes = false,
  showZeroLikes = false,
  isAuthenticated,
  onFavoritesChanged=()=>{},
  ...rest
}) {
  const { user, setUser } = useSession();
  const { setTrackList } = useTrackList();
  const { favoriteTracks, setFavoriteTracks } = useFavoriteTracks();
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const track_id = trackObject?.id;
  const isFavorite =
    track_id && favoriteTracks.some((track) => track.id === track_id);
  const canShowLikes = showLikes && (trackObject?.favorites_count > 0 || showZeroLikes);
  
  const handleAddFavoriteTrack = async () => {
    if (!isAuthenticated()) {
      return;
    }
    try {
      setLoading(true);
      // Optimistically update the list of tracks
      setTrackList((prevTracks) => {
        return prevTracks.map((track) =>
          track.id === track_id ? { ...track, favorites_count: parseInt(track.favorites_count) + 1 } : track
        );
      });
      // Update favorite tracks by adding the new track
      setFavoriteTracks((prevTracks) => {
        return [...prevTracks, trackObject];
      });

      // Send request to backend
      await addFavoriteTrack(track_id, user.id);
      onFavoritesChanged(parseInt(trackObject.favorites_count) + 1);
    } catch (error) {
      console.error("Error adding favorite track:", error);
      // Revert changes if the request fails
      setTrackList((prevTracks) => {
        return prevTracks.map((track) =>
          track.id === track_id ? { ...track, favorites_count: parseInt(track.favorites_count) - 1 } : track
        );
      });
      setFavoriteTracks((prevTracks) => {
        return prevTracks.filter((track) => track.id !== track_id);
      });
      onFavoritesChanged(parseInt(trackObject.favorites_count));
    }
    setLoading(false);
  };

  const handleRemoveFavoriteTrack = async () => {
    if (!isAuthenticated()) {
      return;
    }
    try {
      setLoading(true);
      // Optimistically update the list of tracks
      setFavoriteTracks((prevTracks) =>
        prevTracks.filter((track) => track.id !== track_id),
      );
      // Update the track list by decrementing the favorites count
      setTrackList((prevTracks) =>
        prevTracks.map((track) =>
          track.id === track_id
            ? { ...track, favorites_count: parseInt(track.favorites_count) - 1 }
            : track,
        ),
      );

      // Send request to backend
      await removeFavoriteTrack(track_id, user.id);
      onFavoritesChanged(parseInt(trackObject.favorites_count) - 1);
    } catch (error) {
      console.error("Error removing favorite track:", error);
      // Revert UI changes if the request fails
      setFavoriteTracks((prevTracks) => [...prevTracks, trackObject]);
      setTrackList((prevTracks) =>
        prevTracks.map((track) =>
          track.id === track_id
            ? { ...track, favorites_count: parseInt(track.favorites_count) + 1 }
            : track,
        ),
      );
      onFavoritesChanged(parseInt(trackObject.favorites_count));
    }
    setLoading(false);
  };

  const formatLikesCount = (count) => {
    if (count === 0 || count == undefined) {
      return "0";
    }
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  let icon = (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
    />
  );

  if (isHovered && isFavorite) {
    icon = (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    );
  }

  return (
    <Button
      isIconOnly
      className={`relative flex min-h-0 min-w-0 h-full w-full justify-start bg-transparent ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={isFavorite ? handleRemoveFavoriteTrack : handleAddFavoriteTrack}
      isLoading={loading}
      {...rest}
    >
      <div className="w-full h-full flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isFavorite ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={`h-full ${classNames.svg || ""}`}
        >
          {icon}
        </svg>

        {canShowLikes && (
          <>
            <Spacer x={5} />
            <span className="text-sm font-medium text-default-500-light opacity-75">
              {formatLikesCount(trackObject.favorites_count)}
            </span>
          </>
        )}
      </div>
    </Button>
  );
}

FavoriteButton.propTypes = {
  className: PropTypes.string,
  classNames: PropTypes.object,
  track: PropTypes.object.isRequired,
  showLikes: PropTypes.bool,
  onClick: PropTypes.func,
};

export default withAuthGuard(FavoriteButton);