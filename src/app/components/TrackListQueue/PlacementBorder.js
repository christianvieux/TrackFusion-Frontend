// src/components/TrackListQueue/PlacementBorder.js
import React from "react";
import PropTypes from 'prop-types';

const PlacementBorder = ({ position, itemBeingDragged, setPlacementDrop }) => {
  if (!itemBeingDragged) return null;

  return (
    <div
      id="placement-border"
      onMouseEnter={() => setPlacementDrop(position)}
      onMouseLeave={() => setPlacementDrop(null)}
      className={`absolute left-0 right-0 z-20 ${
        position === "above" 
          ? "top-0 bg-purple-lightest/0" 
          : "bottom-0 bg-pink-light/0"
      } h-1/2 w-full`}
    />
  );
};

PlacementBorder.propTypes = {
  position: PropTypes.oneOf(['above', 'below']).isRequired,
  itemBeingDragged: PropTypes.any,
  setPlacementDrop: PropTypes.func.isRequired,
};

PlacementBorder.defaultProps = {
  itemBeingDragged: null,
};

export default PlacementBorder;