import { useCallback, useRef } from "react";

import FavoriteButton from "../FavoriteButton";
import TrackOptionsMenu from "../TrackOptionsDropdown";

export default function QueueTrackActions({ track }) {
  const favoriteButtonRef = useRef(null);

  const triggerFavoriteButtonClick = useCallback(() => {
    favoriteButtonRef.current?.click();
  }, []);

  return (
    <div className="flex items-center justify-center gap-1">
      <TrackOptionsMenu
        track={track}
        size="sm"
      />
    </div>
  );
}