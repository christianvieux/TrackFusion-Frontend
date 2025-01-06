//app/feed/page.js
"use client";
import "../../../public/css/feed.css";
import React from "react";
import { useEffect, useState, useCallback } from "react";
import TrackList_Table from "../components/TrackList/TrackList_Table.js";
import { useSession } from "../context/SessionContext.js";
import { fetchRecentTracks } from "../services/trackService.js";

export default function FeedPage(props) {
  const x = useSession();
  const { user, setUser } = x;
  const [publicTracks, setPublicTracks] = useState([]);


  useEffect(() => {
    async function fetchTracksData() {
      try {
        const result = await fetchRecentTracks();
        setPublicTracks(result);
      } catch (error) {
        console.error("Failed to fetch recent tracks:", error);
      }
    }
    fetchTracksData();
  }, [user, setUser]);

  return (
    <div id="latest-tracks" className="flex h-full flex-col gap-5 bg-black rounded-lg p-4 m-4 overflow-y-auto">
      {/* Title */}
      <h2 className="text-3xl font-semibold text-purple-light">
        Browse the latest tracks
      </h2>
      {/* Table goes in here */}
      <TrackList_Table trackList={publicTracks} setTrackList={setPublicTracks}/>
    </div>
  );
}
