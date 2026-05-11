"use client";

import UpdatePasswordForm from "./components/UpdatePasswordForm";
import UpdateProfilePictureForm from "./components/UpdateProfilePictureForm";
import { useUserInfo } from "../../context/UserInfoContext";

export default function AccountSettings({ className = "" }) {
  const { userInfo, setUserInfo } = useUserInfo();

  function handleProfilePictureUpdate(newUrl) {
    const updatedUrl = `${newUrl}?v=${Date.now()}`;

    setUserInfo((prev) => ({
      ...prev,
      profile_picture_url: updatedUrl,
    }));
  }

  return (
    <section
      id="Settings"
      className={`flex w-full flex-wrap items-start justify-center gap-8 overflow-auto p-4 text-foreground ${className}`}
    >
      <UpdateProfilePictureForm
        className="!self-start"
        initialProfilePicture={userInfo?.profile_picture_url}
        onSubmit={handleProfilePictureUpdate}
      />

      <UpdatePasswordForm />
    </section>
  );
}