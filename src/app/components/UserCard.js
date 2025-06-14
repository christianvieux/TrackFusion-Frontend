import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  User,
} from "@nextui-org/react";
import Link from 'next/link'
import { fetchPublicUserInfo } from "../services/userService";

export default function UserCard({ userId }) {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const profilePictureUrlWithVersion = userInfo.profile_picture_url
    ? `${userInfo.profile_picture_url}?v=${new Date(userInfo.updated_at).getTime()}`
    : null;

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetchPublicUserInfo(userId);
        setUserInfo(response);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching user info:", userId, error);
      }
    };

    fetchUserInfo();
  }, [userId]);

  return (
    <Link href={`/profile/${userInfo.id}`} className="size-full">
      <div className="group/x hover:text-green-light flex items-center gap-4 rounded-3xl p-2 px-4 bg-black">
          <Avatar
            color="primary"
            isBordered
            className="text-purple-light size-6 flex-shrink-0 ring-purple-light/40 ring-offset-4 ring-offset-purple-dark group-hover/x:text-green-light group-hover/x:ring-green-light"
            classNames={{
              // base: "w-6 h-6"
              base: "bg-transparent",
            }}
            src={userInfo.profile_picture_url}
            alt={userInfo.username}
            size="sm"
          />
          <p className="inline-block flex-shrink-0 truncate font-bold text-purple-light group-hover/x:text-green-light">
            {userInfo.username || "Tony Reichert"}
          </p>
        </div>
    </Link>
  );
}
