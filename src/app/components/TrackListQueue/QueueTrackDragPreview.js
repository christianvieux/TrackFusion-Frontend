import { createPortal } from "react-dom";

import TrackCardBase from "../TrackCard";

export default function QueueTrackDragPreview({
  track,
  dragPosition,
  dragOffset,
  width,
  rightContent,
}) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="pointer-events-none fixed rounded-lg bg-muted p-2 opacity-30 shadow-2xl drop-shadow-2xl"
      style={{
        transform: `translate3d(${dragPosition.x - dragOffset.x}px, ${
          dragPosition.y - dragOffset.y
        }px, 0) rotate(2deg) scale(1.02)`,
        width,
        willChange: "transform",
        left: 0,
        top: 0,
        zIndex: 9999,
      }}
    >
      <TrackCardBase
        track={track}
        className="text-foreground"
        rightContent={rightContent}
      />
    </div>,
    document.body,
  );
}