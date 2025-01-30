"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  Image,
  Tabs,
  Tab,
  Button,
  Textarea,
  Link,
  Skeleton,
  User,
} from "@nextui-org/react";
import NextImage from "next/image";
import { fetchPublicUserInfo, fetchUserPublicTracks, fetchUserPublicFavoriteTracks } from "../../services/userService";
import TrackList from "../../components/TrackList/TrackList_Table";
import ShareProfileModal from "../../components/ShareProfile_Modal"
import ShareModal from "../../components/Share_Modal"

const LoadingSkeleton = () => (
  <Card className="w-full p-4 self-start bg-purple-black">
    <div className="flex flex-col gap-8">
      {/* Profile Header Skeleton */}
      <div className="flex items-start gap-4">
        <Skeleton className="size-32 rounded-full" /> {/* Avatar */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48 rounded-lg" /> {/* Username */}
          <Skeleton className="h-4 w-32 rounded-lg" /> {/* Join date */}
          <Skeleton className="h-4 w-24 rounded-lg" /> {/* Track count */}
        </div>
      </div>
      
      {/* Stats Skeleton */}
      <div className="flex gap-8">
        {[1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-1">
            <Skeleton className="h-6 w-16 rounded-lg" />
            <Skeleton className="h-4 w-24 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  </Card>
);

const UserProfilePage = () => {
  const { id: userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [userTracks, setUserTracks] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("tracks");
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const user = await fetchPublicUserInfo(userId);
        setUserData(user);
        
        const [tracks, favorites] = await Promise.all([
          fetchUserPublicTracks(userId),
          fetchUserPublicFavoriteTracks(userId)
        ]);
        
        console.log(tracks, favorites)
        setUserTracks(tracks);
        setUserFavorites(favorites);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div
      id="profile_page"
      className="mt-4 flex size-full items-start justify-center overflow-y-auto"
    >
      <ShareModal
        visible={showShareModal}
        setVisible={setShowShareModal}
        url={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/profile/${userId}`}
        title="Share Profile"
        description="Share your profile with others"
      />

      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <Card className="p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="text-xl font-bold text-danger">Error</div>
            <p>{error}</p>
          </div>
        </Card>
      ) : (
        <div className="flex w-full flex-col items-center gap-8 p-4">
          {/* Profile Header Card */}
          <Card className="w-full bg-purple-black p-6">
            <div className="flex flex-col gap-8 md:flex-row">
              {/* Left Column - Avatar and Basic Info */}
              <div className="flex items-start gap-6">
                <Image
                  as={NextImage}
                  src={
                    userData.profile_picture_url || "/images/default-avatar.jpg"
                  }
                  fallbackSrc="/images/default-avatar.jpg"
                  alt={`${userData.username}'s avatar`}
                  width={128}
                  height={128}
                  className="rounded-full object-cover"
                />

                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl font-bold">{userData.username}</h1>
                  <p className="text-sm text-default-500">
                    Joined {new Date(userData.created_at).toLocaleDateString()}
                  </p>
                  <Button
                    size="sm"
                    variant="bordered"
                    className="mt-2 w-fit"
                    onClick={() => setShowShareModal(true)}
                  >
                    Share Profile
                  </Button>
                </div>
              </div>

              {/* Right Column - Stats */}
              <div className="flex flex-wrap gap-8 md:ml-auto">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold">
                    {userTracks.length}
                  </span>
                  <span className="text-sm text-default-500">Tracks</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold">
                    {userFavorites.length}
                  </span>
                  <span className="text-sm text-default-500">Favorites</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs and Content */}
          <Card className="w-full bg-purple-black p-4">
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={setSelectedTab}
              aria-label="User content tabs"
              className="w-full"
            >
              <Tab key="tracks" title="Tracks">
                <TrackList
                  trackList={userTracks}
                  setTrackList={setUserTracks}
                  emptyMessage="No tracks uploaded yet"
                  className="mt-4 bg-black-dark"
                />
              </Tab>
              <Tab key="favorites" title="Favorites">
                <TrackList
                  trackList={userFavorites}
                  setTrackList={setUserFavorites}
                  emptyMessage="No favorite tracks yet"
                  className="mt-4 bg-black-dark"
                />
              </Tab>
            </Tabs>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;