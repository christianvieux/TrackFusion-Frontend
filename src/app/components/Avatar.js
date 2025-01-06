// src/app/components/Avatar.js
import React, { useState, useEffect } from "react";
import { Button, Avatar } from "@nextui-org/react";

export default function AvatarComponent({src, className, ...props}) {
  return (
    <Avatar src={src || "/default-avatar.png"} className={`${className}`} {...props} />
  );
}