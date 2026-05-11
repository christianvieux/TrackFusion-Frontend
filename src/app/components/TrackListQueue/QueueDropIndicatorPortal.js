import { createPortal } from "react-dom";

import DropIndicator from "./DropIndicator";

export default function QueueDropIndicatorPortal({
  canDrag,
  isHovered,
  itemBeingDragged,
  placementDrop,
  cardElement,
}) {
  if (!canDrag || !cardElement || typeof document === "undefined") return null;

  const rect = cardElement.getBoundingClientRect();

  return createPortal(
    <DropIndicator
      isHovered={isHovered}
      itemBeingDragged={itemBeingDragged}
      className="pointer-events-none fixed left-0 w-full"
      style={{
        top:
          placementDrop === "above"
            ? `${rect.top - 2}px`
            : `${rect.bottom - 2}px`,
        width: `${rect.width}px`,
        left: `${rect.left}px`,
        zIndex: 8888,
      }}
    />,
    document.body,
  );
}