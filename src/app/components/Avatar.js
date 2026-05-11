"use client";

import { Avatar } from "@heroui/react";

const FALLBACK_AVATAR = "/images/pfp-pic.jpg";

export default function AvatarComponent({
  src,
  alt = "User avatar",
  fallback = "U",
  className = "",
  ...props
}) {
  return (
    <Avatar className={className} {...props}>
      <Avatar.Image alt={alt} src={src || FALLBACK_AVATAR} />
      <Avatar.Fallback>{fallback}</Avatar.Fallback>
    </Avatar>
  );
}