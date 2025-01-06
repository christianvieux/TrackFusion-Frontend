//app/myTracks/page.js
"use client";

import "../../../public/css/myTracks.css";
import React, { useEffect, useState } from "react";
import { useSession } from "../context/SessionContext.js";
import { fetchOwnedTracks } from "../services/user.js";
import withAuth from "../hoc/withAuth.js";
import TrackList_Table from "../components/TrackList/TrackList_Table.js";


function MyTracksPage({params, someProp}) {
  const user = useSession()?.user
  const [ownedTracks, setOwnedTracks] = useState([]);
  
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    async function fetchTracksData() {
      try {
        const result = await fetchOwnedTracks();
        setOwnedTracks(result);
      } catch (error) {
        console.error("Failed to fetch owned tracks:", error);
      }
    }
    fetchTracksData();
  }, [user]);


  return (
    <div id="favoriteTracks" className="size-full">
      <div id="track-items" className="rounded-lg m-4 p-4 bg-black overflow-auto flex flex-col gap-5">
        {/* Title */}
        <h2 className="whitespace-nowrap text-purple-light text-3xl font-semibold">
          Your Owned Tracks
        </h2>
        <div id="list" className="flex flex-col gap-8">
            {/* Content */}
            <div className="flex flex-col">
              {/* Table goes in here */}
              <TrackList_Table trackList={ownedTracks} setTrackList={setOwnedTracks} />
            </div>
          </div>
      </div>
    </div>
  );
}


export default withAuth(MyTracksPage);