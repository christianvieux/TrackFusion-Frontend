// src/app/components/playButton.js

import React from "react";
import { Button } from "@nextui-org/react";

export default function PlayIcon({ className="", ...args }) {
  const Base_Svg_Args = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "currentColor",
    viewBox: "0 0 100 100",
    strokeWidth: "1.5",
    stroke: "currentColor",
    className: `size-full ${className}`,
  };
  return (
    <svg id="play_svg" {...Base_Svg_Args} {...args}>
      <polygon points="35,20 80,50 35,80"></polygon>
    </svg>
  );
}
