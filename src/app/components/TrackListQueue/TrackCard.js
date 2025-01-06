// TrackCard.js
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import Track_Options_Menu from "../Track_Options_Dropdown";
import FavoriteButton from "../favoriteButton";
import DropIndicator from "./DropIndicator";
import TrackCard_ from "../TrackCard";
import { createPortal } from "react-dom";

const Portal = ({ children }) => {
  return createPortal(children, document.body);
};

// Custom debounce using requestAnimationFrame
const useRAFDebounce = (callback, deps = []) => {
  const frame = useRef();

  const debouncedCallback = useCallback((...args) => {
    if (frame.current) {
      cancelAnimationFrame(frame.current);
    }

    frame.current = requestAnimationFrame(() => {
      callback(...args);
    });
  }, deps);

  // Add cleanup
  useEffect(() => {
    return () => {
      if (frame.current) {
        cancelAnimationFrame(frame.current);
      }
    };
  }, []);

  return debouncedCallback;
};

const determineDropPlacement = (e, cardRef, track, prev) => {
  if (
    !prev.itemBeingDragged ||
    prev.itemBeingDragged.uniqueId === track.uniqueId
  ) {
    return prev;
  }

  const rect = cardRef.current.getBoundingClientRect();
  const mouseY = e.clientY;
  // Add buffer zones (10% of card height)
  const bufferSize = rect.height * 0.1;
  const topBuffer = rect.top + bufferSize;
  const bottomBuffer = rect.bottom - bufferSize;

  // If mouse is in buffer zones, maintain previous state
  if (mouseY < topBuffer || mouseY > bottomBuffer) {
    return prev;
  }

  const cardCenterY = rect.top + rect.height / 2;

  return {
    ...prev,
    lastItemHovered: track,
    placementDrop: mouseY < cardCenterY ? "above" : "below",
  };
};

const TrackCard = ({
  track,
  playlist,
  state,
  setState,
  handleDrop,
  canDrag = true,
  selectedTrackId,
  setSelectedTrackId,
  classNames = {},
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressedDown, setIsPressedDown] = useState(false);
  const cardRef = useRef(null);
  const favoriteButtonRef = useRef(null);
  const [initialClickPos, setInitialClickPos] = useState({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const DRAG_THRESHOLD = 5; // pixels
  
  const debouncedSetState = useRAFDebounce(
    (e) => {
      if (!canDrag) return;
      setState((prev) => determineDropPlacement(e, cardRef, track, prev));
    },
    [canDrag, track, setState],
  );

  const handleClick = useCallback((e) => {
    if (isDragging) return; // Ignore click if dragging

    setSelectedTrackId(prev => 
      prev === track.uniqueId ? null : track.uniqueId
    );
  }, [track.uniqueId, setSelectedTrackId, isDragging]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault(); // Always prevent default behavior
    setIsPressedDown(true);
    setInitialClickPos({ x: e.clientX, y: e.clientY });

  }, [canDrag]);

  const handleMouseEnter = useCallback(
    (e) => {
      setIsHovered(true);
  
      setState((prev) => {
        // Always update itemHovered
        const newState = {
          ...prev,
          itemHovered: track,
        };
  
        // Only execute drag-related updates if canDrag is true
        if (
          canDrag &&
          prev.itemBeingDragged &&
          prev.itemBeingDragged.uniqueId !== track.uniqueId
        ) {
          const rect = cardRef.current.getBoundingClientRect();
          const mouseY = e.clientY;
          const cardCenterY = rect.top + rect.height / 2;
  
          return {
            ...newState,
            lastItemHovered: track,
            placementDrop: mouseY < cardCenterY ? "above" : "below",
          };
        }
  
        return newState;
      });
    },
    [track, setState, canDrag],
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);

    setState((prev) => {
      // Always reset itemHovered
      const newState = {
        ...prev,
        itemHovered: null,
      };

      // Clear lastItemHovered and placement if dragging
      if (prev.itemBeingDragged) {
        return {
          ...newState,
          lastItemHovered: null,
          placementDrop: null,
        };
      }

      return newState;
    });
  }, [setState]);

  const handleGlobalMouseMove = useCallback((e) => {
    if (!isPressedDown) return;
  
    const deltaX = Math.abs(e.clientX - initialClickPos.x);
    const deltaY = Math.abs(e.clientY - initialClickPos.y);
    
    // Only start drag if we've moved past threshold
    if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
      if (canDrag && !isDragging) {
        // Start drag
        const rect = cardRef.current.getBoundingClientRect();
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        setIsDragging(true);
        setState(prev => ({ 
            ...prev, 
            itemBeingDragged: track,
            isDragging: true 
          }));
      }
      setDragPosition({ x: e.clientX, y: e.clientY });
    }
  }, [isPressedDown, isDragging, initialClickPos, track, setState, canDrag]);

  const handleGlobalMouseUp = useCallback(
    (e) => {
      setIsPressedDown(false);
      setIsDragging(false);

      // Only call handleDrop if we were actually dragging
      if (isDragging) {
        handleDrop();
      }

      setState((prev) => ({
        ...prev,
        itemBeingDragged: null,
        isDragging: false,
      }));
    },
    [isDragging, handleDrop, setState],
  );

  const handleMouseMove = useCallback(
    (e) => {
      debouncedSetState(e);
    },
    [debouncedSetState],
  );

  const triggerFavoriteButtonClick = () => {
    favoriteButtonRef.current?.click();
  };

  const trackRightContent = useMemo(
    () => (
      <>
        <div className="flex items-center justify-center gap-1">
          <Track_Options_Menu
            ref={favoriteButtonRef}
            track={track}
            additionalOptions={[
              {
                text: "Favorite",
                startContent: (
                  <FavoriteButton
                    ref={favoriteButtonRef}
                    variant="light"
                    track={track}
                  />
                ),
                onPress: triggerFavoriteButtonClick,
              },
            ]}
            size="sm"
          />
        </div>
      </>
    ),
    [track, triggerFavoriteButtonClick],
  );

  const isTrackSelected = selectedTrackId != null && selectedTrackId === track.uniqueId;

  // useEffect for global mouse events:
  useEffect(() => {
    if (isPressedDown) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isPressedDown, handleGlobalMouseMove, handleGlobalMouseUp]);

  return (
    <div
      ref={cardRef}
      className={`relative ${canDrag ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"} transition-all duration-200`}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {/*  */}
      <TrackCard_
        track={track}
        show_play_pause_button={isTrackSelected}
        className={`rounded-lg p-2 ${classNames.TrackCard || ""} ${isDragging ? "opacity-50" : "opacity-100"} ${isTrackSelected ? "bg-purple-indigo text-green" : ""} `}
        rightContent={trackRightContent}
      />
      {/* Dragging Card */}
      {isDragging && (
        <Portal>
          <div
            className="pointer-events-none fixed rounded-lg bg-gray-darker p-2 opacity-30 shadow-2xl drop-shadow-2xl"
            style={{
              transform: `translate3d(${dragPosition.x - dragOffset.x}px, ${dragPosition.y - dragOffset.y}px, 0) rotate(2deg) scale(1.02)`,
              width: cardRef.current?.offsetWidth,
              willChange: "transform",
              position: "fixed",
              left: 0,
              top: 0,
              zIndex: 9999,
            }}
          >
            <TrackCard_
              track={track}
              className="text-green"
              rightContent={trackRightContent}
            />
          </div>
        </Portal>
      )}
      {/* Render indicator in portal */}
      {canDrag && (
        <Portal>
          <DropIndicator
            isHovered={isHovered}
            itemBeingDragged={state.itemBeingDragged}
            className="pointer-events-none fixed left-0 w-full"
            style={{
              top:
                state.placementDrop === "above"
                  ? `${cardRef.current?.getBoundingClientRect().top - 2}px`
                  : `${cardRef.current?.getBoundingClientRect().bottom - 2}px`,
              width: `${cardRef.current?.getBoundingClientRect().width}px`,
              left: `${cardRef.current?.getBoundingClientRect().left}px`,
              zIndex: 8888,
            }}
          />
        </Portal>
      )}
    </div>
  );
};

export default TrackCard;
