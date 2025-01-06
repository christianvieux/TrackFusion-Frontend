import React from "react";
export default function TrackFileIcon({ className, ...rest }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`size-4 ${className}`}
        {...rest}
      >
        <path d="M10.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v8.4" />
        <path d="M8 18v-7.7L16 9v7" />
        <circle cx="14" cy="16" r="2" />
        <circle cx="6" cy="18" r="2" />
      </svg>
    );
}