// src/app/settings/page.js
"use client"

import React from "react";
import UpdatePasswordForm from "../components/UpdatePasswordForm";
import UpdateProfilePictureForm from "../components/UpdateProfilePictureForm"
import { useUserInfo } from "../context/UserInfoContext";
import withAuth from "../hoc/withAuth";

function Settings() {
    const { userInfo, setUserInfo } = useUserInfo();

    const onProfilePictureSubmit = async (data) => {
        setUserInfo((prev) => {
          const updatedUrl = `${data?.url}?v=${new Date().getTime()}`;
          return { ...prev, profile_picture_url: updatedUrl };
        });
      };

    return (<div id="Settings" className="p-4 flex items-start flex-wrap justify-center gap-8 overflow-auto text-green">
        <UpdateProfilePictureForm className="!self-start" initialProfilePicture={userInfo?.profile_picture_url} onSubmit={onProfilePictureSubmit}/>
        <UpdatePasswordForm />
    </div>)
};

export default withAuth(Settings);