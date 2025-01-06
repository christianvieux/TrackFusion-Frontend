// src/app/components/TrackListQueue/TrackListQueue.js

import React, { useState, useCallback, useEffect, useMemo, memo } from "react";
import { Card, CardBody } from "@nextui-org/react";
import useDragAndDrop from "./useDragAndDrop";
import ScrollableContainer from "../ScrollableContainer";
import TrackCard from "./TrackCard";

import { useTrackManager } from "../../context/TrackManagerContext";
import { usePlayback } from "../../context/PlaybackContext";

const RenderTrackList = memo(({
  trackItems,
  array,
  title,
  containerId,
  className = "",
  state,
  playlist,
  handleDroppableAreaEnter,
  handleDroppableAreaLeave,
  setState,
  selectedTrackId,
  setSelectedTrackId,
  handleDrop,
  getArrayFromTrack,
}) => {
  return (
    <div
      id={containerId}
      className={`p-2 rounded-md ${state.activeDroppableArea && state.activeDroppableArea == array && state.itemBeingDragged && getArrayFromTrack(state.itemBeingDragged) != array ? "outline-dashed outline-green" : "" } ${className}`}
      onMouseEnter={() => handleDroppableAreaEnter(array)}
      onMouseLeave={handleDroppableAreaLeave}
    >
      <p className="mb-3 text-xl font-bold">{title}</p>
      <ScrollableContainer
        canScroll={state.itemBeingDragged}
        className="flex min-h-20 w-full flex-col"
      >
        {trackItems.map((track) => (
          <TrackCard
            key={track.uniqueId}
            track={track}
            playlist={playlist}
            state={state}
            setState={setState}
            selectedTrackId={selectedTrackId}
            setSelectedTrackId={setSelectedTrackId}
            handleDrop={handleDrop}
          />
        ))}
      </ScrollableContainer>
    </div>
  );
});

const TrackListQueue = ({ canShow, className, classNames = {} }) => {
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const {
    currentTrack,
    queue,
    setQueue,
    playlist,
    setPlaylist,
    currentTrackIndex,
  } = useTrackManager();
  const { canShowPlayback } = usePlayback();

  const getArrayFromTrack = (track) => {
    if (queue.some((item) => item.uniqueId === track.uniqueId)) {
      return queue;
    } else if (playlist.some((item) => item.uniqueId === track.uniqueId)) {
      return playlist;
    }
    return null;
  };

  const moveTrackToContainer = useCallback(
    (trackToMove, targetContainer) => {
      const sourceContainer = getArrayFromTrack(trackToMove);
      if (sourceContainer === targetContainer) return;

      console.log(sourceContainer, targetContainer);

      const newSourceContainer = sourceContainer.filter(
        (track) => track.uniqueId !== trackToMove.uniqueId,
      );
      const newTargetContainer = [...targetContainer, trackToMove];

      if (sourceContainer === queue) {
        setQueue(newSourceContainer);
        setPlaylist(newTargetContainer);
      } else {
        setQueue(newTargetContainer);
        setPlaylist(newSourceContainer);
      }
    },
    [queue, playlist, setQueue, setPlaylist],
  );

  const moveTrack = useCallback(
    (fromTrack, toTrack, placement, targetContainer) => {
      if (!fromTrack) return;

      // Prevent moving a track onto itself in the same container
      if (
        toTrack &&
        fromTrack.uniqueId === toTrack.uniqueId &&
        getArrayFromTrack(fromTrack) === getArrayFromTrack(toTrack)
      ) {
        return;
      }
      // Move track to a different container
      if (!toTrack && targetContainer) {
        moveTrackToContainer(fromTrack, targetContainer);
        return;
      }
      if (!toTrack) return;
      const fromTrackArray = getArrayFromTrack(fromTrack);
      const toTrackArray = getArrayFromTrack(toTrack);

      if (fromTrackArray === toTrackArray) {
        // Same container
        const fromIndex = fromTrackArray.findIndex(
          (track) => track.uniqueId === fromTrack.uniqueId,
        );
        let toIndex = toTrackArray.findIndex(
          (track) => track.uniqueId === toTrack.uniqueId,
        );
        const newArray = [...fromTrackArray];
        newArray.splice(fromIndex, 1);
        // Adjust `toIndex` if necessary
        if (fromIndex < toIndex) {
          toIndex -= 1;
        }
        newArray.splice(
          placement === "above" ? toIndex : toIndex + 1,
          0,
          fromTrack,
        );
        if (fromTrackArray === queue) {
          setQueue(newArray);
        } else {
          setPlaylist(newArray);
        }
      } else {
        // Different container
        const fromIndex = fromTrackArray.findIndex(
          (track) => track.uniqueId === fromTrack.uniqueId,
        );
        const toIndex = toTrackArray.findIndex(
          (track) => track.uniqueId === toTrack.uniqueId,
        );
        const newFromTrackArray = [...fromTrackArray];
        const newToTrackArray = [...toTrackArray];

        newFromTrackArray.splice(fromIndex, 1);
        newToTrackArray.splice(
          placement === "above" ? toIndex : toIndex + 1,
          0,
          fromTrack,
        );
        if (fromTrackArray === queue) {
          setQueue(newFromTrackArray);
          setPlaylist(newToTrackArray);
        } else {
          setQueue(newToTrackArray);
          setPlaylist(newFromTrackArray);
        }
      }
    },
    [queue, playlist, setQueue, setPlaylist, moveTrackToContainer],
  );

  const [
    state,
    setState,
    handleDrop,
    handleDroppableAreaEnter,
    handleDroppableAreaLeave,
  ] = useDragAndDrop(moveTrack);

  if (!canShowPlayback) {
    return null;
  }
  const filtered_playlist = playlist.filter(
    (_, index) =>
      index >
      playlist.findIndex(
        (item) =>
          item.uniqueId === currentTrack?.uniqueId,
      ),
  )

  const commonProps = {
    state,
    setState,
    playlist,
    handleDroppableAreaEnter,
    handleDroppableAreaLeave,
    selectedTrackId,
    setSelectedTrackId,
    handleDrop,
    getArrayFromTrack,
  };

  return (
    <Card
      className={`flex h-full w-80 flex-col items-center justify-center overflow-visible rounded-2xl text-green !transition-max-size duration-[2000ms] !bg-black ${(!canShow && `max-h-0 max-w-0 overflow-hidden p-0`) || `max-h-full max-w-full ${className}`}`}
      isBlurred
      shadow="sm"
    >
      <CardBody className="p-0">
        <ScrollableContainer canScroll={state.itemBeingDragged} className={`flex flex-col gap-2 p-4 ${classNames.Base || ""}`}>
          {/* Current Track */}
          {currentTrack && (
            <div id="CurrentTrack" className="p-2">
              <p className="mb-3 text-xl font-bold text-white/70">
                Currently Playing
              </p>
              <TrackCard
                canDrag={false}
                classNames={{ TrackCard: "text-white/70" }}
                track={{ ...currentTrack, uniqueId: "Currently_Playing" }}
                state={state}
                setState={setState}
                selectedTrackId={selectedTrackId}
                setSelectedTrackId={setSelectedTrackId}
                handleDrop={handleDrop}
              />
            </div>
          )}
          {/* Queue */}
          {queue.length > 0 && (
            <RenderTrackList
              title="Queue"
              containerId="Queue"
              trackItems={queue}
              array={queue}
              {...commonProps}
            />
          )}
          {/* Playlist */}
          <RenderTrackList
            title={"Next from Playlist"}
            containerId={"Playlist"}
            array={playlist}
            trackItems={filtered_playlist}
            {...commonProps}
          />
        </ScrollableContainer>
      </CardBody>
    </Card>
  );
};

export default TrackListQueue;
