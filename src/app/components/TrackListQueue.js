"use client";
import { useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { act, useState } from "react";
import { createPortal } from "react-dom";
import Track_Options_Menu from "./Track_Options_Menu";
import { Avatar, Button } from "@nextui-org/react";
import { CameraIcon } from "./CameraIcon";
import FavoriteButton from "./favoriteButton";
import { useTrackManager } from "../context/TrackManagerContext";

function Droppable(props) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div className={props.className} ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}

function Draggable(props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable",
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      className={props.className}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {props.text}
    </div>
  );
}

function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TrackCard className={props.className} track={props.track} />
    </div>
  );
}

const TrackCard = function (props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      className={`flex items-center gap-4 bg-black/80 px-2 text-green ${props.className}`}
    >
      <div className="relative size-9">
        {(isHovered && (
          <Button isIconOnly variant="light">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="absolute left-1/4 top-1/4 z-10 size-1/2 bg-black/30 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
              />
            </svg>
          </Button>
        )) || (
          <Avatar
            className="h-full w-full"
            size="sm"
            radius="sm"
            showFallback
            // src="https://images.unsplash.com/broken"
            fallback={
              <CameraIcon
                className="h-full w-full"
                fill="currentColor"
                size={40}
              />
            }
          />
        )}
      </div>

      <div className="flex w-32 flex-col">
        {/* name of track*/}
        <p className="truncate text-left text-base font-bold">
          {props.track.track_name}
        </p>
        {/* name of artist */}
        <p className="truncate text-left text-sm">{props.track.track_artist}</p>
      </div>

      {/* Interactions */}
      <div className="flex items-center justify-center gap-1">
        {/* Favorite Button */}
        <FavoriteButton
          className="h-6 w-6"
          variant="light"
          item={props.track}
        />
        {/* Options Menu */}
        <Track_Options_Menu item={props.track} size="sm" />
      </div>

      {/* Handle */}
      {/* <svg
        
        className="size-4"
        fill="currentColor"
        stroke="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          color="currentColor"
          d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"
        ></path>
      </svg> */}
    </button>
  );
};

const TrackListQueue = React.memo(({ classNames = {} }) => {
  const {
    currentTrack,
    queue,
    setQueue,
    playlist,
    setPlaylist,
    currentTrackIndex,
  } = useTrackManager();
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      console.log(active, over);
      // setItems((items) => {
      //   const oldIndex = items.findIndex((item) => item.id === active.id);
      //   const newIndex = items.findIndex((item) => item.id === over.id);

      //   return arrayMove(items, oldIndex, newIndex);
      // });
    }
  }
  function findArrayById(id) {
    if (queue.find((item) => item.id === id)) {
      return queue;
    } else if (playlist.find((item) => item.id === id)) {
      return playlist;
    }
  }
  function handleDragEnd(event) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeArray = findArrayById(active.id);
      const overArray = findArrayById(over.id);

      if (activeArray == overArray) {
        const setActiveState = activeArray == queue ? setQueue : setPlaylist;

        const oldIndex = activeArray.findIndex((item) => item.id === active.id);
        const newIndex = activeArray.findIndex((item) => item.id === over.id);
        const newArray = arrayMove(activeArray, oldIndex, newIndex);
        setActiveState([...newArray]);
      }
    }
  }
  function handleDragOver(event) {
    const { active, over } = event;

    console.log(active, over);
    if (over && active.id !== over.id) {
      console.log(active.id, over.id);
      const activeArray = findArrayById(active.id);
      const overArray = findArrayById(over.id);
      const setActiveState = activeArray == queue ? setQueue : setPlaylist;
      const setOverState = overArray == queue ? setQueue : setPlaylist;

      if (activeArray != overArray) {
        const activeIndex = activeArray.findIndex(
          (item) => item.id === active.id,
        );
        const overIndex = overArray.findIndex((item) => item.id === over.id);

        const activeItem = activeArray[activeIndex];
        const overItem = overArray[overIndex];

        activeArray.splice(activeIndex, 1);
        overArray.splice(overIndex, 0, activeItem);

        setActiveState([...activeArray]);
        setOverState([...overArray]);
      }
    }
  }

  const DroppableContainer = function ({ className, id, items, children }) {
    if (items.length > 0) {
      return <div className={className}>{children}</div>;
    } else {
      return (
        <Droppable className={className} id={id}>
          {children}
        </Droppable>
      );
    }
  };

  const DroppableArea = ({ title, id, items, classNames, children }) => (
    <div className="flex flex-col">
      {" "}
      {/* DndContext */}
      {/* Title */}
      <p className="mb-3 font-bold">{title}</p>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <DroppableContainer
          className={`flex flex-col gap-2 ${classNames.DroppableContainer}`}
          id={id}
          items={items}
        >
          {children}
        </DroppableContainer>
        {/* {typeof document !== 'undefined' && createPortal(
        <DragOverlay>
          {activeId ? <SortableItem key={activeId} id={activeId} text={"test?"} /> : null}
        </DragOverlay>,
        document.body
      )} */}
      </SortableContext>
    </div>
  );

  // Log whenever the component re-renders
  useEffect(() => {
    console.log("TrackListQueue component re-rendered");
  });

  useEffect(() => {
    console.log("Changed");
  }, [currentTrack, queue, setQueue, playlist, setPlaylist, currentTrackIndex]);

  return (
    <DndContext
      sensors={sensors}
      // collisionDetection={closestCenter}
      onDragOver={handleDragOver}
      // onDragEnd={handleDragEnd}
      // autoScroll={{layoutShiftCompensation: false}}
    >
      <div className={`flex-col ${classNames.Base}`}>
        {/* <p className="text-green font-bold">Now playing</p>
        <TrackCard className="mb-5" track={currentTrack} /> */}
        <div className="flex gap-14">
          {queue.length > 0 && (
            <DroppableArea
              title="Next in Queue"
              id="Queue"
              classNames={classNames}
              items={queue}
            >
              {queue.map((track, index) => {
                const { id } = track;
                const currentTrackIndex = queue.findIndex(
                  (item) => item.id === currentTrack?.id,
                );
                return <SortableItem key={id} id={id} track={track} />;
              })}
            </DroppableArea>
          )}
          {playlist.length > 0 && (
            <DroppableArea
              title="Next from Playlist"
              id="Playlist"
              classNames={classNames}
              items={playlist}
            >
              {playlist.map((track, index) => {
                const { id } = track;
                const currentTrackPlayingFromPlaylist =
                  playlist[currentTrackIndex];
                const currentTrackIndexInPlaylist = playlist.findIndex(
                  (item) => item.id === currentTrackPlayingFromPlaylist?.id,
                );
                if (index <= currentTrackIndexInPlaylist) {
                  return;
                }
                return <SortableItem key={id} id={id} track={track} />;
              })}
            </DroppableArea>
          )}
        </div>
      </div>
    </DndContext>
  );
});
export default TrackListQueue;
