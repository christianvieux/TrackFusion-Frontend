"use client";

import { useEffect, useState } from "react";
import { Card } from "@heroui/react";
import { useParams } from "next/navigation";

import { fetchTrack } from "../../../services/trackService";
import { fetchPublicUserInfo } from "../../../services/userService";

import LoadingSkeleton from "./LoadingSkeleton";
import StateCard from "./StateCard";
import TrackCoverCard from "./TrackCoverCard";
import TrackInfoPanel from "./TrackInfoPanel";

export default function TrackDetailsPage() {
  const { id: trackId } = useParams();

  const [track, setTrack] = useState(null);
  const [creator, setCreator] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  function handleFavoriteCountChange(newCount) {
    setTrack((currentTrack) => ({
      ...currentTrack,
      favorites_count: newCount,
    }));
  }

  useEffect(() => {
    let isMounted = true;

    async function loadTrack() {
      if (!trackId) return;

      try {
        setIsLoading(true);
        setError(null);

        const trackData = await fetchTrack(trackId);

        if (!trackData) {
          throw new Error("Track not found");
        }

        const creatorData = await fetchPublicUserInfo(
          trackData.creator_id
        );

        if (!isMounted) return;

        setTrack(trackData);
        setCreator(creatorData);
      } catch (error) {
        if (!isMounted) return;

        setError(error.message || "Something went wrong");
      } finally {
        if (!isMounted) return;

        setIsLoading(false);
      }
    }

    loadTrack();

    return () => {
      isMounted = false;
    };
  }, [trackId]);

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className="flex w-full items-center justify-center">
        <StateCard
          title="Track Unavailable"
          message={error || "This track could not be loaded."}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-max justify-center px-4 py-8">
      <Card className="w-full max-w-5xl border-2 border-accent bg-secondary p-5 text-foreground shadow-card">
        <div
          id="Main_Container"
          className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]"
        >
          <TrackCoverCard
            track={track}
            creator={creator}
            onFavoritesChanged={handleFavoriteCountChange}
          />

          <TrackInfoPanel track={track} />
        </div>
      </Card>
    </div>
  );
}