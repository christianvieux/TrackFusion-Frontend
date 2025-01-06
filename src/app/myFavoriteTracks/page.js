//app/feed/page.js
"use client";
import "../../../public/css/myFavoriteTracks.css";
import React, { useEffect } from "react";
import TrackList_Table from "../components/TrackList/TrackList_Table.js";
import withAuth from "../hoc/withAuth.js";
import { useFavoriteTracks } from "../context/FavoriteTracksContext.js";

function MyFavoriteTracksPage(props) {
  const { favoriteTracks, setFavoriteTracks, refresh, loading } = useFavoriteTracks();


  // Fetch/Refresh favorite tracks on page load
  useEffect(() => {
    refresh();
  });

  return (
    <div
      id="favoriteTracks"
      className="flex flex-col m-4 h-full overflow-auto rounded-lg bg-black p-4 gap-2"
    >
        {/* Title */}
        <h2 className="whitespace-nowrap text-3xl font-semibold text-purple-light">
          Your Favorite Tracks
        </h2>

        <TrackList_Table trackList={favoriteTracks} setTrackList={setFavoriteTracks} />
    </div>
  );
}

export default withAuth(MyFavoriteTracksPage);
