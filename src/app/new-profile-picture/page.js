"use client";
// src/app/new-profile-picture/page.js
import React, { useEffect } from "react";
import { useUserInfo } from "../context/UserInfoContext";
import { useRouter } from "next/navigation";
import { withAuthGuard } from "../hoc/withAuthGuard";
import UpdateProfilePictureForm from "../components/UpdateProfilePictureForm";

function InitialProfilePictureSetup() {
  const router = useRouter();
  const { userInfo, setUserInfo } = useUserInfo();

  const handleProfilePictureSubmit = async (newUrl) => {
    try {
      setUserInfo((prev) => {
        const updatedUrl = `${newUrl}?v=${new Date().getTime()}`;
        return { ...prev, profile_picture_url: updatedUrl };
      });
      router.push("/feed");
    } catch (error) {
      // Handle upload error
      console.error("Couldn't upload profile picture: ", error)
    }
  };

  const handleSkip = () => {
    router.push("/feed");
  };

  useEffect(() => {
    if (userInfo) {
      if (userInfo.profile_picture_url) {
        console.log("idk")
        router.push("/feed")
      }
    }
  }, [userInfo, router])
  
  return (
    <div id="new_profile_page" className="flex items-center justify-center p-4 overflow-auto max-h-full max-w-full">
      <div id="container" className="gap-8 flex flex-col bg-black border-2 border-gray-dark p-4 max-h-full max-w-md overflow-y-auto">
        <h1 className="text-3xl font-bold text-green-light w-max">
          {`Welcome, ${userInfo?.username || ""}`}
        </h1>

        <div className="text-foreground">
          <p className="text-base leading-relaxed">
            Personalize your profile with a profile picture. A photo helps other
            members recognize you and adds a personal touch to your account.
          </p>
        </div>

          <UpdateProfilePictureForm
            initialProfilePicture={null}
            onSubmit={handleProfilePictureSubmit}
            isInitialSetup={true}
            className="overflow-x-auto max-w-full"
          />
        

        <div className="text-sm italic text-foreground/70">
          <p className="mb-4">
            Not ready to upload a photo? That's okay. You can always add or
            update your profile picture later in Account Settings.
          </p>

          <button
            onClick={handleSkip}
            className="text-green-light underline transition-colors duration-300 hover:text-green"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}

export default withAuthGuard(InitialProfilePictureSetup);
