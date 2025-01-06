// src/app/components/TrackListQueue/useDragAndDrop.js
import { useState, useCallback, useEffect } from "react";

const useDragAndDrop = (moveTrack) => {
  const [state, setState] = useState({
    itemBeingDragged: null,
    itemHovered: null,
    lastItemHovered: null,
    placementDrop: null,
    activeDroppableArea: null,
    isDragging: false,
  });

  const handleDrop = useCallback(() => {
    if (state.itemBeingDragged) {
      if (state.itemHovered && state.placementDrop) {
        // Track-to-track drop
        moveTrack(
          state.itemBeingDragged,
          state.itemHovered,
          state.placementDrop,
          state.activeDroppableArea
        );
      } else if (state.activeDroppableArea) {
        // Container-level drop
        moveTrack(
          state.itemBeingDragged,
          null,
          'below',
          state.activeDroppableArea
        );
      }
    }
  
    setState({
      itemBeingDragged: null,
      itemHovered: null,
      lastItemHovered: null,
      placementDrop: null,
      activeDroppableArea: null,
      isDragging: false,
    });
  }, [state, moveTrack]);

  const handleDroppableAreaEnter = useCallback((targetArray) => {
    setState((prev) => ({
      ...prev,
      activeDroppableArea: targetArray,
    }));
  }, []);

  const handleDroppableAreaLeave = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activeDroppableArea: null,
    }));
  }, []);
  
  return [
    state,
    setState,
    handleDrop,
    handleDroppableAreaEnter,
    handleDroppableAreaLeave,
  ];
};

export default useDragAndDrop;
