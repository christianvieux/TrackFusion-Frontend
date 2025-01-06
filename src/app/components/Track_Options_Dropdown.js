//components/Track_Options_Menu.js
import React, { useEffect, useRef, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Tooltip,
  Snippet,
} from "@nextui-org/react";
import Track_Configuration from "../components/Track_Configuration";
import { useDisclosure } from "@nextui-org/react";
import { useTrackManager } from "../context/TrackManagerContext";
import { useSession } from "../context/SessionContext";
import ShareModal from "./Share_Modal";
import ShareIcon from "./Icons/ShareIcon";
import QueueIcon from "./Icons/QueueIcon";
import RemoveFromQueueIcon from "./Icons/RemoveFromQueueIcon";
import EditIcon from "./Icons/EditIcon";
import TrackFileIcon from "./Icons/TrackFileIcon"
import UserIcon from "./Icons/UserIcon"
import { useRouter } from "next/navigation";

export default function TrackOptionsDropdown({
  className = "",
  track: item,
  size,
  additionalOptions = [
    // example: { text: "Add to playlist", startContent: (</>), onPress: () => {}, ...props }
  ],
  ...props
}) {
  const router = useRouter();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onOpenChange: onModalOpenChange,
  } = useDisclosure();
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = (toggle) => {
    // console.log("Hi", item.id)
    // Focus on the button after it's clicked
    setIsOpen(toggle);
  };
  const {
    initializePlaylist,

    playlist,
    setPlaylist,

    queue,
    setQueue,

    currentTrackIndex,
    setCurrentTrackIndex,

    currentTrack,
    setCurrentTrack,

    addTrackToPlaylist,
    removeTrackFromPlaylist,

    addTrackToQueue,
    removeTrackFromQueue,
  } = useTrackManager();

  // console.log(item);

  const { user } = useSession();
  const userId = user?.id;
  const isTrackInQueue = queue.find(
    (track) =>
      track.uniqueId && item.uniqueId && track.uniqueId === item.uniqueId,
  );
  const isTrackInPlaylist = playlist.find(
    (track) =>
      track.uniqueId && item.uniqueId && track.uniqueId === item.uniqueId,
  );
  const canConfigureTrack = item.creator_id == userId;

  const [showShareModal, setShowShareModal] = useState(false);
  const track_url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/track/${item.id}`
  const creator_url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/profile/${item.creator_id}`

  return (
    <div className={`${className}`} {...props}>
      <Track_Configuration
        trackDetails={item}
        isModalOpen={isModalOpen}
        onModalOpen={onModalOpen}
        onModalOpenChange={onModalOpenChange}
        closeModal={() => onModalOpenChange(false)}
      />
      {/* Share Modal */}
      <ShareModal
        visible={showShareModal}
        setVisible={setShowShareModal}
        url={track_url}
        title="Share Track"
        description="Ready to share? Copy the link below to spread the music!"
      />
      {/*  */}
      <Dropdown
        onOpenChange={handleClick}
        className="border-2 border-gray/50 bg-gray-darkest"
      >
        <DropdownTrigger>
          <Button
            size={size}
            isIconOnly
            variant="light"
            className={`text-green ${isOpen && "bg-gray/50"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
              />
            </svg>
          </Button>
        </DropdownTrigger>
        <DropdownMenu className="" variant="light" aria-label="Static Actions">
          {/* Add to Queue */}
          <DropdownItem
            textValue="Add to Queue"
            onPress={() => {
              addTrackToQueue(item);
            }}
            key="Add to Queue"
            className="text-green-dark"
            startContent={<QueueIcon />}
          >
            Add to queue
          </DropdownItem>

          {/* Remove from Queue */}
          {isTrackInQueue && (
            <DropdownItem
              textValue="Remove from Queue"
              onPress={() => {
                removeTrackFromQueue(item.uniqueId);
              }}
              key="Remove from Queue"
              className="text-green-dark"
              startContent={<RemoveFromQueueIcon />}
            >
              Remove from queue
            </DropdownItem>
          )}
          {/* View Track */}
          <DropdownItem
              textValue="View Track"
              onPress={() => {
                router.push(track_url)
              }}
              key="View Track"
              className="text-green-dark"
              startContent={<TrackFileIcon />}
            >
              Go to track
            </DropdownItem>
            {/* View creator */}
          <DropdownItem
              textValue="View Creator"
              onPress={() => {
                router.push(creator_url)
              }}
              key="View Creator"
              className="text-green-dark"
              startContent={<UserIcon />}
            >
              Go to creator
            </DropdownItem>
          {/* Remove from Playlist */}
          {isTrackInPlaylist && (
            <DropdownItem
              textValue="Remove from Playlist"
              onPress={() => {
                removeTrackFromPlaylist(item.uniqueId);
              }}
              startContent={<RemoveFromQueueIcon />}
              key="Remove from Playlist"
              className="text-green-dark"
            >
              Remove from playlist
            </DropdownItem>
          )}

          <DropdownItem
            textValue="Copy link"
            key="copy"
            className="text-green-dark"
            startContent={<ShareIcon />}
            onPress={() => {
              setShowShareModal(!showShareModal);
            }}
          >
            Share
          </DropdownItem>

          {/* Additional options */}
          {additionalOptions.map((option, index) => (
            <DropdownItem
              className="text-green-dark"
              textValue={option.text}
              key={index}
              startContent={<div className="size-4">{option.startContent}</div>}
              onPress={option.onPress}
              {...option.props}
            >
              {option.text}
            </DropdownItem>
          ))}

          {canConfigureTrack && (
            <DropdownItem
              textValue="Configure this track"
              onPress={onModalOpen}
              key="Configure this track"
              className="text-purple-lightest"
              startContent={<EditIcon />}
            >
              Configure this track
            </DropdownItem>
          )}

          {/* <DropdownItem  onPress={handleDelete} key="delete" className="text-danger" color="danger">
          Delete file
        </DropdownItem> */}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
