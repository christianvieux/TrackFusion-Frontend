"use client";
// src/app/track/[id].page.js

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  Image,
  Button,
  Progress,
  Textarea,
  Code,
  Chip,
  Select,
  SelectItem,
  Link,
  Skeleton,
} from "@nextui-org/react";
// import { HeartIcon, PlayIcon, PauseIcon } from '../../components/Icons'; // You'll need to create these icons
import { fetchTrack } from "../../services/trackService";
import { fetchPublicUserInfo } from "../../services/user";
import NextImage from "next/image";
import Favorite_Button from "../../components/favoriteButton";
import Play_Button from "../../components/Icons/PlayIcon";
import Pause_Button from "../../components/Icons/PauseIcon";
import ShareIcon from "../../components/Icons/ShareIcon";
import ShareModal from "../../components/ShareTrack_Modal";
import Track_Options_Dropdown from "../../components/Track_Options_Dropdown";
import PlayPause_Button from "../../components/PlayPause_Button";
import TrackAttribute_Chip from "../../components/TrackAttribute_Chip";
import { useDeletedTracks } from "../../context/deletedTracksContext";

const AttributeList = ({ attribute = "", values = [] }) => {
  // Capitalize first letter of attribute
  const capitalizedAttribute =
    attribute.charAt(0).toUpperCase() + attribute.slice(1);

  return (
    <div className="flex w-full gap-4">
      {/* Attribute label */}
      <p className="w-16 shrink-0 font-bold text-default-600">
        {capitalizedAttribute}:
      </p>

      {/* Values container */}
      <div className="flex w-3/4 gap-2 overflow-x-auto pb-3">
        {values.map((value) => (
          <TrackAttribute_Chip variant="dot" key={value} attribute={value} />
        ))}
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <Card className="w-auto p-4">
    <div className="flex flex-col gap-8 mid:flex-row">
      {/* Left side - Track Card */}
      <div className="flex flex-col">
        {/* Cover Art Skeleton */}
        <Skeleton className="size-[300px] rounded-lg" />
        
        {/* Creator and Controls Skeleton */}
        <div className="mt-4 flex justify-between">
          <div className="flex gap-2">
            <Skeleton className="h-4 w-8 rounded-lg" /> {/* "By" text */}
            <Skeleton className="h-4 w-24 rounded-lg" /> {/* Creator name */}
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16 rounded-lg" /> {/* Favorites count */}
            <Skeleton className="h-4 w-8 rounded-lg" /> {/* Options button */}
          </div>
        </div>

        {/* Status Skeleton */}
        <div className="mt-2 flex items-center gap-2">
          <Skeleton className="h-2 w-2 rounded-full" /> {/* Status dot */}
          <Skeleton className="h-4 w-16 rounded-lg" /> {/* Status text */}
        </div>
      </div>

      {/* Right side - Track Info */}
      <div className="flex max-w-[300px] flex-col gap-3">
        {/* Title and Artist Skeleton */}
        <Skeleton className="h-8 w-3/4 rounded-lg" /> {/* Title */}
        <Skeleton className="h-6 w-1/2 rounded-lg" /> {/* Artist */}
        <Skeleton className="h-4 w-32 rounded-lg" /> {/* Upload date */}
        
        {/* Description Skeleton */}
        <Skeleton className="h-20 w-full rounded-lg" />
        
        {/* Attributes Skeleton */}
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-lg" /> {/* Attribute label */}
              <Skeleton className="h-6 w-32 rounded-lg" /> {/* Attribute value */}
            </div>
          ))}
        </div>
      </div>
    </div>
  </Card>
);

const TrackPage = () => {
  // const trackData = {
  //   id: "1",
  //   title: "Awesome Track",
  //   artist: "Cool Artist",
  //   coverUrl: "/track-cover.jpg",
  //   audioUrl: "/track.mp3",
  //   uploadDate: "2024-03-15",
  //   description: "An amazing track that will blow your mind",
  //   creator: "Producer X",
  //   likes: 1337,
  // };

  // Normally you'd fetch this from an API
  const { deletedTracks, addDeletedTrack } = useDeletedTracks();
  const { id: trackId } = useParams(); // this will hold the dynamic parameter value
  const [error, setError] = useState(null);
  const [trackData, setTrackData] = useState({});
  const [creatorData, setCreatorData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [ favoriteHovered, setFavoriteHovered ] = useState(false);
  const [ playPauseHovered, setPlayPauseHovered ] = useState(false);
  const audioRef = useRef(null);

  const handleFavoriteCountChange = (newCount) => {
    setTrackData((prevData) => ({ ...prevData, favorites_count: newCount }));
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Fetch track data and creator data
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetchTrack(trackId)
      .then((data) => {
        if (!data) throw new Error("Track not found");
        setTrackData(data);
        console.log(data);
        return fetchPublicUserInfo(data.creator_id);
      })
      .then((userData) => {
        setCreatorData(userData);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [trackId]);

  // Check if track is deleted
  useEffect(() => {
    const numericTrackId = Number(trackId);
    if (deletedTracks.includes(numericTrackId)) {
      setIsDeleted(true);
    }
  }, [deletedTracks, trackId]);
  return (
    <div className="flex w-full items-center justify-center">
      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <Card className="w-auto p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="text-xl font-bold text-danger">Error</div>
            <p>{error}</p>
          </div>
        </Card>
      ) : isDeleted ? (
        <Card className="w-auto p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="text-xl font-bold text-danger">Track Deleted</div>
            <p>This track is no longer available.</p>
          </div>
        </Card>
      ) : (
        <Card className="w-auto p-4">
          {/* Main container */}
          <div
            id="Main_Container"
            className="flex flex-col gap-8 overflow-y-auto mid:flex-row"
          >
            {/* Card */}
            <div id="Track_Card" className="flex flex-col">
              {/* Cover Art */}
              <div className="relative">
                {/* Play/Pause Button */}
                <div className="absolute bottom-2 left-2 z-20 flex items-center gap-4 opacity-50 hover:opacity-100">
                  <PlayPause_Button
                    className="rounded-lg bg-black text-green"
                    variant="flat"
                    track={trackData}
                  />
                </div>
                {/* Favorite Button */}
                <div className="absolute bottom-2 right-2 z-20 opacity-50 hover:opacity-100">
                  <Favorite_Button
                    className="rounded-lg bg-black p-1"
                    classNames={{
                      svg: "h-8 w-8",
                    }}
                    track={trackData}
                    onFavoritesChanged={handleFavoriteCountChange}
                  />
                </div>
                <Image
                  as={NextImage}
                  src={trackData.image_url || "/images/6068474.jpg"}
                  fallbackSrc="/images/6068474.jpg"
                  alt={trackData.title || "Track Cover"}
                  width={300}
                  height={300}
                  classNames={{
                    wrapper:
                      "size-[300px] aspect-square rounded-lg object-cover",
                  }}
                />
              </div>

              <div className="mt-auto flex w-full items-start justify-between px-2">
                {/* Creator */}
                <div className="flex w-1/3 flex-col items-start justify-start gap-4">
                  {/* Creator */}
                  <div id="Creator" className="flex w-3/4 items-start gap-1">
                    <span className="text-sm text-default-600">By </span>
                    <Link
                      href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/profile/${creatorData.id}`}
                      className="overflow-x-auto truncate text-nowrap text-sm !text-green-light hover:text-green-light"
                    >
                      {creatorData.username}
                    </Link>
                  </div>
                </div>

                {/* Options */}
                <div
                  id="controls"
                  className="flex items-center justify-between gap-4"
                >
                  {/* Favorites */}
                  <div className="flex items-center gap-2">
                    <span className="text-default-600">
                      {trackData.favorites_count || 0}
                    </span>
                    <span className="text-sm text-default-500">favorites</span>
                  </div>
                  {/* Options */}
                  <Track_Options_Dropdown track={trackData} />
                </div>
              </div>

              {/* Status */}
              <div className="mt-auto flex items-center gap-2 px-2">
                <span
                  className={`h-2 w-2 rounded-full ${trackData.is_private ? "bg-danger" : "bg-success"}`}
                />
                <span>{trackData.is_private ? "Private" : "Public"}</span>
              </div>
            </div>
            {/* Track Info - Scrollable Container*/}
            <div className="flex max-w-[300px] flex-col gap-3">
              {/* Track Title */}
              <div>
                <h1 className="w-full overflow-x-auto text-pretty pb-3 text-2xl font-bold">
                  {trackData.name}
                </h1>
                <p className="text-xl">{trackData.artist}</p>
                <p className="text-gray-500 text-sm">
                  Uploaded on{" "}
                  {new Date(trackData.created_at).toLocaleDateString()}
                </p>
              </div>
              {/* Description */}
              <Textarea
                isReadOnly
                label="Description"
                variant="bordered"
                labelPlacement="outside"
                value={trackData.description || "No description provided"}
                maxRows={3}
              />
              {/* Attributes Section */}
              <div className="space-y-2">
                {Object.entries({
                  category: trackData.category,
                  mood: trackData.mood,
                  genre: trackData.genre,
                }).map(([attribute, values]) => {
                  if (!values) return null;
                  return (
                    <AttributeList
                      key={attribute}
                      attribute={attribute}
                      values={
                        typeof values === "string"
                          ? values
                              .replace(/[{}]/g, "")
                              .split(",")
                              .filter(Boolean)
                          : []
                      }
                    />
                  );
                })}

                {trackData.bpm && (
                  <AttributeList attribute="bpm" values={[trackData.bpm]} />
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TrackPage;
