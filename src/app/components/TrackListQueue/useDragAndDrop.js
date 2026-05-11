import { useCallback, useState } from "react";

const INITIAL_DRAG_STATE = {
  itemBeingDragged: null,
  itemHovered: null,
  lastItemHovered: null,
  placementDrop: null,
  activeDroppableArea: null,
  isDragging: false,
};

export default function useDragAndDrop(moveQueueItem) {
  const [state, setState] = useState(INITIAL_DRAG_STATE);

  const resetDragState = useCallback(() => {
    setState(INITIAL_DRAG_STATE);
  }, []);

  const handleDrop = useCallback(() => {
    const {
      itemBeingDragged,
      itemHovered,
      placementDrop,
      activeDroppableArea,
    } = state;

    if (!itemBeingDragged) {
      resetDragState();
      return;
    }

    if (itemHovered && placementDrop) {
      moveQueueItem(
        itemBeingDragged,
        itemHovered,
        placementDrop,
        activeDroppableArea,
      );
    } else if (activeDroppableArea) {
      moveQueueItem(itemBeingDragged, null, "below", activeDroppableArea);
    }

    resetDragState();
  }, [state, moveQueueItem, resetDragState]);

  const handleDroppableAreaEnter = useCallback((targetContainer) => {
    setState((currentState) => ({
      ...currentState,
      activeDroppableArea: targetContainer,
    }));
  }, []);

  const handleDroppableAreaLeave = useCallback(() => {
    setState((currentState) => ({
      ...currentState,
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
}