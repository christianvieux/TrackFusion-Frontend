// src/components/TrackListQueue/DropIndicator.js
import React from "react";

// DropIndicator.js
const DropIndicator = ({ isHovered, itemBeingDragged, placementDrop, className="", ...rest }) => {
    const canShow = isHovered && itemBeingDragged;
    return (
      canShow && (
        <div className={`pointer-events-none absolute z-10 flex w-[90%] items-center justify-center rounded-full ${className}`} {...rest}>
          <div className="pointer-events-none absolute left-0 z-10 flex size-3 translate-x-[-50%] items-center justify-center rounded-full bg-green-dark">
            <div className="pointer-events-none size-[50%] rounded-full bg-white/50"></div>
          </div>
          <div className="w- pointer-events-none absolute z-0 h-1 w-full rounded-full bg-green-dark"></div>
        </div>
      )
    );
  };

  export default DropIndicator;