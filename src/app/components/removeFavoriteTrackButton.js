import { useState } from 'react';
import { removeFavoriteTrack } from '../services/userService'

const RemoveFavoriteTrackButton = ({ item: trackObject, onRemove}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onRemove}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isHovered ? 'none' : 'currentColor'}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke={isHovered ? 'currentColor' : 'currentColor'}
        className="size-6"
      >
        {isHovered ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        )}
      </svg>
      {isHovered && (
        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-75 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 mr-1"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
          {/* <span>Remove</span> */}
        </div>
      )}
    </button>
  );
};

export default RemoveFavoriteTrackButton;
