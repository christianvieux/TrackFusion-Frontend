// src/app/components/TrackAttribute_Chip.js

import React from "react";
import {Chip } from "@nextui-org/react";
import { getColorForAttribute } from "../../config/Colors"


export default function TrackAttribute_Chip({ attribute="", className = "", ...props }) {
  return (
    <Chip color={getColorForAttribute(attribute)} className={`flex items-center ${className}`} {...props}>
      {attribute}
    </Chip>
  );
}