import React, { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownSection,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
} from "@nextui-org/react";
import Avatar from "./Avatar"
import { useSession } from "../context/SessionContext";
import { logoutUser } from "../services/auth";
import { useRouter } from "next/navigation";
import GearIcon from "./Icons/GearIcon";
import UserMinusIcon from "./Icons/UserMinusIcon";
import UserIcon from "./Icons/UserIcon";
import UserAddIcon from "./UserAddIcon";
import ProfileIcon from "./Icons/ProfileIcon"
import { useUserInfo } from "../context/UserInfoContext";


export default function App({ className, ...props }) {
  const { user, setUser } = useSession();
  const { userInfo, setUserInfo } = useUserInfo();
  const router = useRouter();

  const handleLogoutUser = async function () {
    try {
      const success = await logoutUser();

      if (success) {
        setUser(null);
        // Explicitly wait for the router to push
        router.push("/home");
      }
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const profilePictureUrlWithVersion = userInfo?.profile_picture_url
    ? `${userInfo.profile_picture_url}?v=${new Date(userInfo.updated_at).getTime()}`
    : null;
  
  return (
    <Dropdown
      className={`bg-gray-darkest ${className}`}
      placement="bottom-start"
      {...props}
    >
      <DropdownTrigger>
        <button
          className={`flex items-center justify-center gap-2 truncate rounded-full p-2 ${(user && "text-blue-dark") || "text-green"}`}
        >
          <Avatar
            className="border-2 border-green text-black"
            size="sm"
            showFallback
            src={profilePictureUrlWithVersion}
          />
          {/* <User
                as="button"
                avatarProps={{
                isBordered: true,
                src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                }}
                className="transition-transform"
                description="@tonyreichert"
                name="Tony Reichert"
            /> */}
          <p className="text-lg font-semibold">
            {(user && user.username) || "New User"}
          </p>
        </button>
      </DropdownTrigger>
      <DropdownMenu
        classNames={{ list: "text-green" }}
        aria-label="Signed as @tonyreichert"
        variant="light"
        disabledKeys={["profile"]}
      >
        {!user && (
          <DropdownItem
            className="text-green duration-[100ms]"
            key="Sign_in"
            href="/login"
            startContent={<UserIcon />}
          >
            Sign in
          </DropdownItem>
        )}
        {!user && (
          <DropdownItem
            className="text-green duration-[100ms]"
            key="Sign_up"
            href="/signup"
            startContent={<UserAddIcon />}
          >
            Create Account
          </DropdownItem>
        )}
        {user && (
          <DropdownSection
            showDivider
            classNames={{ divider: "duration-[100ms] bg-gray-dark" }}
            title={`Signed as ${user.email}`}
          >
            <DropdownItem
          className="duration-[100ms] hover:bg-gray-dark"
          key="Profile"
          href={`/profile/${user.id}`}
          startContent={<ProfileIcon />}
        >
          View Profile
        </DropdownItem>
            <DropdownItem
              className="duration-[100ms] hover:bg-gray-dark"
              key="settings"
              href="/settings"
              startContent={<GearIcon />}
            >
              Account Settings
            </DropdownItem>
          </DropdownSection>
        )}
        {user && (
          <DropdownSection>
            <DropdownItem
              className="text-danger duration-[100ms] hover:bg-gray-dark"
              key="logout"
              color="danger"
              startContent={<UserMinusIcon />}
              onPress={handleLogoutUser}
            >
              Log Out
            </DropdownItem>
          </DropdownSection>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
